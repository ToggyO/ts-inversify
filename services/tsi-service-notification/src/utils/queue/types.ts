/**
 * Description: Types for Bull queue constructor.
 */

import { SendMailOptions } from 'nodemailer';

import { IService } from 'interfaces';

import { MailTypes } from 'utils/mailer';

export type IQueueService = IService;

export type MailQueue = {
  mailType: MailTypes;
  options: SendMailOptions;
  data: Record<string, any>;
};
