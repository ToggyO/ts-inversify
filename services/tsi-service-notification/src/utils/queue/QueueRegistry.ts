/**
 * Description: Class described Bull jobs queue constructor.
 */

import Bull, { Queue, QueueOptions } from 'bull';
import { iterate } from 'iterare';
import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { autobind } from 'utils/helpers';
import { ILogger } from 'utils/logger';

import { IQueueRegistry } from './interfaces';
import { DUPLICATE_QUEUE, NO_QUEUE_FOUND, QUEUE_ERROR, SUCCESSFUL_QUEUE_REGISTRATION } from './constants';

@injectable()
export class QueueRegistry implements IQueueRegistry {
  private readonly _queues = new Map<string, Queue>();

  constructor(@inject(TYPES.ILogger) private readonly _logger: ILogger) {
    autobind(this);
  }

  public getAllQueues(): Map<string, Queue> {
    return this._queues;
  }

  public getQueue<T>(name: string): Queue<T> {
    const queue = this._queues.get(name);
    if (!queue) {
      throw new Error(NO_QUEUE_FOUND(name));
    }
    return queue;
  }

  public async registerQueue(name: string, options: QueueOptions): Promise<void> {
    let queue = this._queues.get(name);
    if (queue) {
      throw new Error(DUPLICATE_QUEUE(name));
    }
    try {
      queue = new Bull(name, options);
      await queue.isReady();
      this._queues.set(name, queue);
      this._logger.info(SUCCESSFUL_QUEUE_REGISTRATION(name));
    } catch (error) {
      this._logger.info(QUEUE_ERROR(name, error));
    }
  }

  public closeAllQueues(): void {
    iterate(this._queues).forEach(([name]) => this.closeQueue(name));
  }

  private closeQueue(name: string): void {
    const queue = this._queues.get(name);
    if (queue) {
      queue.close();
      this._queues.delete(name);
    }
  }
}
