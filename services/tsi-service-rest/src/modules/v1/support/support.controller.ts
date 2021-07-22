/**
 * Description: Support module controller for handling support routing
 */

import { Request, Response, NextFunction } from 'express';
import { Queue } from 'bull';
import { inject, injectable } from 'inversify';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { getSuccessRes } from 'utils/response';
import { autobind, getProp, Mails } from 'utils/helpers';
import { IQueueRegistry, MailQueueDTO } from 'utils/queue';

import { ISupportHandler } from './interfaces';
import { SendTicketDTO } from './types';

@injectable()
export class SupportController extends BaseController implements ISupportHandler {
  protected readonly _mailQueue: Queue;

  constructor(
    @inject(TYPES.IConfiguration) protected readonly configService: IConfiguration,
    @inject(TYPES.IQueueRegistry) queueRegistry: IQueueRegistry,
  ) {
    super();
    autobind(this);
    const maiQueueName = this.configService.get<string>('QUEUE_NAME_MAIL', '');
    this._mailQueue = queueRegistry.getQueue<MailQueueDTO>(maiQueueName);
  }

  public async sendTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<SendTicketDTO>(req, 'body', {});
      const sendMailJob = this.configService.get<string>('QUEUE_JOB_NAME_SEND_EMAIL', '');

      await this._mailQueue.add(sendMailJob, Mails.sendSupportTicket(body));
      await this._mailQueue.add(sendMailJob, Mails.sendSupportReply(body));

      res.status(200).send(getSuccessRes({ resultData: null }));
    } catch (error) {
      next(error);
    }
  }
}
