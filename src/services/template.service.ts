import templatesConfigs from '@/config/templates.config';
import { dirname, join, resolve } from 'path';
import { compile } from 'handlebars';
import InlineCss from 'inline-css';
import { readFile } from 'fs/promises';
import { JSDOM } from 'jsdom';
import appConfig from '@/config/app.config';

export enum HBSTemplates {
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  CONFIRM_DELETING = 'CONFIRM_DELETING',
}

export class HBSTemplateManager {
  private corePath: string;
  private templatePath: string;
  private htmlContent?: string = undefined;

  constructor(private template: HBSTemplates) {
    const templateConfig = templatesConfigs.templateConfig[this.template];
    this.corePath = this._resolvePaths(templateConfig.core);
    this.templatePath = this._resolvePaths(templateConfig.path);
  }

  async parseTemplate<T = Record<string, any>>(data: T) {
    const htmlTemplate = await readFile(this.templatePath, 'utf-8');
    const compiledTemplate = compile(htmlTemplate);
    const htmlContent = compiledTemplate({
      appName: appConfig.appName,
      ...data,
    });
    const cssInlined = await InlineCss(htmlContent, {
      url: 'file://' + this.templatePath,
      removeHtmlSelectors: true,
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
      removeHtmlSelectors: true,
      removeLinkTags: true,
      removeStyleTags: true,
    });

    this.htmlContent = await this._resolveImagePaths(cssCoreInlined);
  }

  getHTMLTemplate() {
    return this.htmlContent;
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

  private _resolvePaths(path: string) {
    return join(__dirname, '../templates/' + path.replaceAll('.', '/') + '.hbs');
  }
}
