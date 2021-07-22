/**
 * Description: Template engine module types
 */

import { Attachment } from 'nodemailer/lib/mailer';

export type TemplateMeta = {
  viewName: string;
  attachmentName: string;
  subject: string;
};

export type CompiledTemplate = {
  template: string;
  attachments: Array<Attachment>;
};

export type MailTemplate = CompiledTemplate & {
  subject: string;
};
