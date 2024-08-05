import templatesConfigs from '@/config/templates.config';
import { dirname, join, resolve } from 'path';
import { compile } from 'handlebars';
import InlineCss from 'inline-css';
import { readFile } from 'fs/promises';
import { JSDOM } from 'jsdom';
import appConfig from '@/config/app.config';

export enum HBSTemplates {
  ACCOUNT_DELETED = 'ACCOUNT_DELETED',
  CONFIRM_DELETING = 'CONFIRM_DELETING',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  PASSWORD_UPDATED = 'PASSWORD_UPDATED',
  RESET_PASSWORD = 'RESET_PASSWORD',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
}

/**
 * HBSTemplateManager Service
 * Class to handle the hbs templates.
 * - Initialize the class with template type.
 * - Call parseTemplate async method to generate the HTML
 * - Call getHTMLTemplate to return the HTML string
 * Usage Example:
 * const _template = new HBSTemplateManager(HBSTemplates.RESET_PASSWORD)
 * await _template.parseTemplate()
 * const htmlContent = _template.getHTMLTemplate()
 */
export class HBSTemplateManager {
  private corePath: string;
  private templatePath: string;
  private templateTextPath: string;
  private htmlContent?: string = undefined;
  private txtContent?: string = undefined;

  constructor(private template: HBSTemplates) {
    const templateConfig = templatesConfigs.templateConfig[this.template];
    this.corePath = this._resolvePaths(templateConfig.core);
    this.templatePath = this._resolvePaths(templateConfig.path);
    this.templateTextPath = this._resolvePaths(templateConfig.path, true);
  }

  async parseTemplate<T = Record<string, any>>(data: T) {
    await this._parseTextContent(data);
    const htmlTemplate = await readFile(this.templatePath, 'utf-8');
    const compiledTemplate = compile(htmlTemplate);
    const htmlContent = compiledTemplate({
      appName: appConfig.appName,
      ...data,
    });
    const cssInlined = await InlineCss(htmlContent, {
      url: 'file://' + this.templatePath,
      removeHtmlSelectors: false,
      removeLinkTags: true,
      removeStyleTags: true,
    });

    const htmlCoreTemplate = await readFile(this.corePath, 'utf-8');
    const compiledCoreTemplate = compile(htmlCoreTemplate, {
      noEscape: true,
    });
    const htmlCoreContent = compiledCoreTemplate({
      content: cssInlined,
    });
    const cssCoreInlined = await InlineCss(htmlCoreContent, {
      url: 'file://' + this.corePath,
      removeHtmlSelectors: false,
      removeLinkTags: true,
      removeStyleTags: true,
    });

    this.htmlContent = await this._resolveImagePaths(cssCoreInlined);
  }

  private async _parseTextContent<T = Record<string, any>>(data: T) {
    const txtContent = await readFile(this.templateTextPath, 'utf-8');
    const compiledTemplate = compile(txtContent);
    this.txtContent = compiledTemplate({
      appName: appConfig.appName,
      ...data,
    });
  }

  getHTMLTemplate() {
    return this.htmlContent;
  }
  getTxtTemplate() {
    return this.txtContent;
  }

  private async _resolveImagePaths(htmlContent: string) {
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    const imgElements = Array.from(document.querySelectorAll('img'));

    for (const imgElement of imgElements) {
      const relativeSrc = imgElement.getAttribute('src');
      if (relativeSrc && !relativeSrc.includes('http') && !relativeSrc.includes('base64')) {
        const absolutePath = resolve('file://', dirname(this.templatePath), relativeSrc);
        const base64Data = await this._getImageBase64Data(absolutePath);
        const parts = relativeSrc.split('.');
        const extension = parts[parts.length - 1];
        const mime = this._getMimetype(extension);
        imgElement.setAttribute('src', `data:${mime};base64,${base64Data}`);
      }
    }

    return dom.serialize();
  }

  private async _getImageBase64Data(imagePath: string): Promise<string> {
    const imageBuffer = await readFile(imagePath);
    return imageBuffer.toString('base64');
  }

  private _getMimetype(extension: string) {
    const map = {
      svg: 'image/svg+xml',
      png: 'image/png',
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
    };

    if (extension in map) {
      return map[extension as keyof typeof map];
    } else {
      return map.png;
    }
  }

  /**
   * Resolve the config doted file path
   * @param path the doted path: emails.confirm-email
   * @param txt get the txt file instead of hbs
   * @returns the parsed path: ~/src/templates/emails/confirm-email.(hbs | txt)
   */
  private _resolvePaths(path: string, txt = false) {
    return join(__dirname, '../templates/' + path.replaceAll('.', '/') + (txt ? '.txt' : '.hbs'));
  }
}
