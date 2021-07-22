/**
 * Description: Template metadata picker
 */

import { MailTypes } from '../../mailer';

import { ITemplator } from './interfaces';
import { TemplateMeta } from './types';
import { MAIL_SUBJECTS } from 'utils/mailer/constants';

export class Templator implements ITemplator {
  public getTemplate(mailType: MailTypes, data?: Record<string, any>): TemplateMeta {
    let viewName: string;
    let attachmentName: string;
    let subject: string;
    switch (mailType) {
      case MailTypes.OtpCode:
        viewName = 'easyguide-otp.hbs';
        attachmentName = 'otp';
        subject = MAIL_SUBJECTS.WELCOME(data!.user);
        break;
      case MailTypes.RestorePassword:
        viewName = 'easyguide-restore-password.hbs';
        attachmentName = 'restore-password';
        subject = MAIL_SUBJECTS.RESTORE_PASSWORD;
        break;
      case MailTypes.Tickets:
        viewName = 'easyguide-tickets.hbs';
        attachmentName = 'tickets';
        subject = MAIL_SUBJECTS.TICKETS;
        break;
      case MailTypes.SupportTicket:
        viewName = 'easyguide-support-ticket.hbs';
        attachmentName = 'support-ticket';
        subject = MAIL_SUBJECTS.SUPPORT.TICKET;
        break;
      case MailTypes.SupportReply:
        viewName = 'easyguide-support-reply.hbs';
        attachmentName = 'support-reply';
        subject = MAIL_SUBJECTS.SUPPORT.REPLY;
        break;
      case MailTypes.TemporaryPassword:
        viewName = 'easyguide-temporary-password.hbs';
        attachmentName = 'temporary-password';
        subject = MAIL_SUBJECTS.WELCOME(data!.user);
        break;
      case MailTypes.ChangeEmailNotification:
        viewName = 'easyguide-change-email-notification.hbs';
        attachmentName = 'change-email-notification';
        subject = MAIL_SUBJECTS.WELCOME(data!.user);
        break;
      case MailTypes.ChangeEmailAlert:
        viewName = 'easyguide-change-email-alert.hbs';
        attachmentName = 'change-email-alert';
        subject = MAIL_SUBJECTS.ALERT;
        break;
      default:
        viewName = '';
        attachmentName = '';
        subject = '';
        break;
    }
    return { viewName, attachmentName, subject };
  }
}
