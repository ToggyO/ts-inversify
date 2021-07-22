/**
 * Description: Class creates a set of cron jobs with given options
 */

import { CronJob } from 'cron';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { Generator, autobind } from 'utils/helpers';

import { ISchedulerOrchestrator, ISchedulerRegistry } from './interfaces';
import { CronJobOptions, TargetHost, OptionsHost } from './types';

@injectable()
export class SchedulerOrchestrator implements ISchedulerOrchestrator {
  private readonly cronJobs: Record<string, CronJobOptions> = {};

  constructor(@inject(TYPES.ISchedulerRegistry) private readonly schedulerRegistry: ISchedulerRegistry) {
    autobind(this);
  }

  public mountCron(): void {
    const cronJobs = Object.keys(this.cronJobs);
    cronJobs.forEach((key) => {
      const { target, options } = this.cronJobs[key];
      const cronJob = new CronJob(
        options.cronTime,
        target,
        undefined,
        false,
        options.timeZone,
        undefined,
        false,
        options.utcOffset,
        options.unrefTimeout,
      );
      cronJob.start();

      this.cronJobs[key].ref = cronJob;
      this.schedulerRegistry.addCronJob(key, cronJob);
    });
  }

  public closeCronJobs(): void {
    Array.from(this.schedulerRegistry.getCronJobs().keys()).forEach((key) =>
      this.schedulerRegistry.deleteCronJob(key),
    );
  }

  public addOptions(target: TargetHost, options: OptionsHost): void {
    const name = options.name || Generator.generateUuidV4();
    this.cronJobs[name] = {
      target,
      options,
    };
  }
}
