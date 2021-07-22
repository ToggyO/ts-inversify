/**
 * Description: Interfaces for Bull queue constructor.
 */

import { Queue, QueueOptions } from 'bull';

export interface IQueueRegistry {
  getAllQueues(): Map<string, Queue>;
  getQueue<T>(name: string): Queue<T>;
  registerQueue(name: string, options: QueueOptions): Promise<void>;
  closeAllQueues(): void;
}

export interface IQueueConsumer {
  runJobs(): Promise<void>;
}
