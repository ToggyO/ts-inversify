/**
 * Description: Interfaces for scheduler module
 */

import { CronJob } from 'cron';

import { CronOptions, OptionsHost, TargetHost } from './types';

export interface ISchedulerRegistry {
  getCronJobs(): Map<string, CronJob>;
  getCronJob(name: string): CronJob;
  addCronJob(name: string, job: CronJob): void;
  deleteCronJob(name: string): void;
}

export interface ISchedulerOrchestrator {
  mountCron(): void;
  closeCronJobs(): void;
  addOptions(target: TargetHost, options: OptionsHost): void;
}

export interface ICron {
  decorate(cronTime: string | Date, options: CronOptions): MethodDecorator;
}
