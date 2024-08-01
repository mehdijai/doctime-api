import { HBSTemplates } from '@/services/template.service';

interface ITemplateBaseConfig {
  core: string;
  path: string;
}

interface ITemplateConfig {
  templateConfig: Record<keyof typeof HBSTemplates, ITemplateBaseConfig>;
}

const templatesConfigs: ITemplateConfig = {
  templateConfig: {
    RESET_PASSWORD: {
      path: 'emails.auth.reset-password',
      core: 'emails.core',
    },
    VERIFY_EMAIL: {
      path: 'emails.auth.confirm-email',
      core: 'emails.core',
    },
    UPDATE_PASSWORD: {
      path: 'emails.auth.update-password',
      core: 'emails.core',
    },
    CONFIRM_DELETING: {
      path: 'emails.auth.confirm-deleting',
      core: 'emails.core',
    },
  },
};

export default templatesConfigs;
