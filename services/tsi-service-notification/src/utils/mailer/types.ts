/**
 * Description: Types for mail service
 */

import { SendMailOptions } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';

import { MailTypes } from './enums';

export type MailerConfiguration = {
  connectionOptions: SMTPTransport.Options;
  messageOptions: Mail.Options;
  appDomain?: string;
  supportMail?: string;
};

export type ExtendedSendMailOptions = {
  mailType: MailTypes;
  options: SendMailOptions;
  data?: Record<string, any>;
};
