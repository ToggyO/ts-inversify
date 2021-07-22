/**
 * Description: Decorator initialize Cron job with given options
 */

import { CRON_JOB_OPTIONS } from './constants';
import { CronOptions, CronTargetHost } from './types';

export function Cron(cronTime: string | Date, options: CronOptions = {}): MethodDecorator {
  return function <TFunction extends CronTargetHost>(
    target: TFunction | Record<string, any>,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    Reflect.defineMetadata(CRON_JOB_OPTIONS, { ...options, cronTime }, descriptor.value);
    return descriptor;
  };
}
