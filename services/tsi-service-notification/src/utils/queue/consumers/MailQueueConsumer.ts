/**
 * Description: Mail queue queue constructor.
 */

import { inject, injectable } from 'inversify';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { ILogger } from 'utils/logger';
import { IMailer } from 'utils/mailer';
import { autobind } from 'utils/helpers';
import { IQueueConsumer, IQueueRegistry, MailQueue } from 'utils/queue';

import { NO_QUEUE_NAME } from '../constants';

@injectable()
export class MailQueueConsumer implements IQueueConsumer {
  private _mailQueueName: string;

  constructor(
    @inject(TYPES.IConfiguration) private readonly _configService: IConfiguration,
    @inject(TYPES.ILogger) private readonly _logger: ILogger,
    @inject(TYPES.IQueueRegistry) private readonly _queueRegistry: IQueueRegistry,
    @inject(TYPES.IMailer) private readonly _mailer: IMailer,
  ) {
    autobind(this);
    this.onModuleInit();
  }

  public async runJobs(): Promise<void> {
    const sendEmailJob = this._configService.get<string>('QUEUE_JOB_NAME_SEND_EMAIL', '');
    const mailQueue = this._queueRegistry.getQueue<MailQueue>(this._mailQueueName);

    try {
      // Using await will freeze server work
      mailQueue.process(sendEmailJob, async (job) => {
        await this._mailer.sendMail(job.data);
        await job.moveToCompleted();
      });
    } catch (error) {
      this._logger.error(`Queue job error: ${error}`);
    }
  }

  private onModuleInit() {
    const mailQueueName = this._configService.get<string>('QUEUE_NAME_MAIL');
    if (!mailQueueName) {
      throw new Error(NO_QUEUE_NAME);
    }
    this._mailQueueName = mailQueueName;
  }
}
