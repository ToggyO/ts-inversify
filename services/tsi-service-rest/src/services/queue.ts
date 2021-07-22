/**
 * Description: Queue service configuration
 */

import { Application } from 'express';
import { Queue } from 'bull';
import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { IService } from 'interfaces';
import { TYPES } from 'DIContainer/types';
import { IQueueRegistry } from 'utils/queue';

@injectable()
export class QueueService implements IService {
  private readonly _redisOpts: Record<string, any>;

  constructor(
    @inject(TYPES.IConfiguration) private readonly _configService: IConfiguration,
    @inject(TYPES.IQueueRegistry) private readonly _queueRegistry: IQueueRegistry,
  ) {
    const isDevelopment = _configService.isDevelopment;
    const TSI_REDIS_HOST = _configService.get<string>('TSI_REDIS_HOST', '');
    const TSI_REDIS_PORT = _configService.get<string>('TSI_REDIS_PORT', '');
    const TSI_REDIS_PASSWORD = _configService.get<string>('TSI_REDIS_PASSWORD', '');
    const TSI_REDIS_EXTERNAL_PORT = _configService.get<string>('TSI_REDIS_EXTERNAL_PORT', '');
    this._redisOpts = {
      host: TSI_REDIS_HOST,
      port: isDevelopment ? parseInt(TSI_REDIS_EXTERNAL_PORT) : parseInt(TSI_REDIS_PORT),
      password: TSI_REDIS_PASSWORD,
      enableReadyCheck: true,
      enableOfflineQueue: false,
    };
  }

  public async run(app: Application): Promise<void> {
    await this.runMailQueue();
  }

  public destroy(): void {
    this._queueRegistry.closeAllQueues();
  }

  private async runMailQueue(): Promise<void> {
    const mailQueueName = this._configService.get<string>('QUEUE_NAME_MAIL', '');
    await this._queueRegistry.registerQueue(mailQueueName, { redis: this._redisOpts });
  }
}
