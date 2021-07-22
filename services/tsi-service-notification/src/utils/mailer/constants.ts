/**
 * Description: Mailer module constants
 */

export const VIEW_DIR = 'src/utils/mailer/templates/views';

export const ASSETS_DIR = 'src/utils/mailer/templates/assets';

export const MAIL_SUBJECTS = {
  WELCOME: (userName: string): string => `Hi ${userName}, Welcome to easyGuide`,
  RESTORE_PASSWORD: `Restore password - easyGuide`,
  TICKETS: 'Tickets - easyGuide',
  SUPPORT: {
    TICKET: 'New support ticket - easyGuide',
    REPLY: 'Support reply - easyGuide',
  },
  ALERT: 'Alert - easyGuide',
};
