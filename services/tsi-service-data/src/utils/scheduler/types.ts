/**
 * Description: Types for scheduler module
 */

import { CronJob } from 'cron';

import { IService } from 'interfaces';

export type CronOptions = {
  /**
   * Specify the name of your cron job. This will allow to inject your cron job reference through `@InjectCronRef`.
   */
  name?: string;

  /**
   * Specify the timezone for the execution. This will modify the actual time relative to your timezone.
   * If the timezone is invalid, an error is thrown. You can check all timezones available at
   * [Moment Timezone Website](http://momentjs.com/timezone/).
   * Probably don't use both ```timeZone``` and ```utcOffset``` together or weird things may happen.
   */
  timeZone?: string;

  /**
   * This allows you to specify the offset of your timezone rather than using the ```timeZone``` param.
   * Probably don't use both ```timeZone``` and ```utcOffset``` together or weird things may happen.
   */
  utcOffset?: string | number;

  /**
   * If you have code that keeps the event loop running and want to stop the node process when that finishes regardless
   * of the state of your cronjob, you can do so making use of this parameter.
   * This is off by default and cron will run as if it needs to control the event loop.
   * For more information take a look at
   * [timers#timers_timeout_unref](https://nodejs.org/api/timers.html#timers_timeout_unref) from the NodeJS docs.
   */
  unrefTimeout?: boolean;
};

export type OptionsHost = CronOptions & Record<'cronTime', string | Date | any>;
export type TargetHost = <T = any>(...args: Array<any>) => T;

export type CronTargetHost = { target: TargetHost };
export type CronOptionsHost = { options: OptionsHost };
export type CronRefHost<T> = { ref?: T };

export type CronJobOptions = CronTargetHost & CronOptionsHost & CronRefHost<CronJob>;

export type ISchedulerService = IService;
