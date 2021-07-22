/**
 * Description: Сlass registers and stores cron jobs
 */

import { CronJob } from 'cron';
import { injectable } from 'inversify';

import { autobind } from 'utils/helpers';

import { ISchedulerRegistry } from './interfaces';
import { NO_SCHEDULER_FOUND, DUPLICATE_SCHEDULER } from './constants';

@injectable()
export class SchedulerRegistry implements ISchedulerRegistry {
  private readonly cronJobs = new Map<string, CronJob>();

  constructor() {
    autobind(this);
  }

  public getCronJobs(): Map<string, CronJob> {
    return this.cronJobs;
  }

  public getCronJob(name: string): CronJob {
    const job = this.cronJobs.get(name);
    if (!job) {
      throw new Error(NO_SCHEDULER_FOUND('Cron Job', name));
    }
    return job;
  }

  public addCronJob(name: string, job: CronJob): void {
    const isExists = this.cronJobs.get(name);
    if (isExists) {
      throw new Error(DUPLICATE_SCHEDULER('Cron Job', name));
    }
    this.cronJobs.set(name, job);
  }

  public deleteCronJob(name: string): void {
    const cronJob = this.getCronJob(name);
    cronJob.stop();
    this.cronJobs.delete(name);
  }
}
