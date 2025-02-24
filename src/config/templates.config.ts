import { HBSTemplates } from '@/services/handlebars.service';

interface ITemplateBaseConfig {
  core?: string;
  path: string;
  onlyTXT?: boolean;
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
    ACCOUNT_DELETED: {
      path: 'emails.auth.account-deleted',
      core: 'emails.core',
    },
    PASSWORD_UPDATED: {
      path: 'emails.auth.password-updated',
      core: 'emails.core',
    },
    MFA_EMAIL: {
      path: 'emails.auth.mfa-email',
      core: 'emails.core',
    },
    OTP_SMS: {
      path: 'sms.auth.otp-message',
      onlyTXT: true,
    },
  },
};

export default templatesConfigs;
