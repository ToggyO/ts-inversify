/**
 * Description: Interfaces for mail service
 */

import { Transporter } from 'nodemailer';

import { ExtendedSendMailOptions, MailerConfiguration } from './types';

export interface IMailer {
  Transporter: Transporter | null;
  init(options: MailerConfiguration): void;
  sendMail(props: ExtendedSendMailOptions): Promise<any>;
}
