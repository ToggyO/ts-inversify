/**
 * Description: Types for Bull queue constructor.
 */

import { IService } from 'interfaces';

import { MailTypes } from 'constants/mail-types.enum';
import { MailOptions } from 'utils/queue';

export type IQueueService = IService;

export type MailQueueDTO = {
  mailType: MailTypes;
  options: MailOptions;
  data?: Record<string, any>;
};
