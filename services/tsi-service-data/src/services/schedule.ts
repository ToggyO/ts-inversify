/**
 * Description: Cron scheduler service
 */

import { Application } from 'express';
import { injectable, inject, interfaces } from 'inversify';

import { FunctionType } from 'declaration';
import { TYPES } from 'DIContainer/types';
import { ISchedulerService, ISchedulerOrchestrator, CRON_JOB_OPTIONS } from 'utils/scheduler';
import { IMetadataScanner } from 'utils/metadataScanner';
import { IBindingDictionaryService } from 'utils/bindings';

@injectable()
export class SchedulerService implements ISchedulerService {
  constructor(
    @inject(TYPES.ISchedulerOrchestrator) private readonly schedulerOrchestrator: ISchedulerOrchestrator,
    @inject(TYPES.IMetadataScanner) private readonly metadataScanner: IMetadataScanner,
    @inject(TYPES.IBindingDictionaryService) private readonly bindingsService: IBindingDictionaryService,
  ) {}

  public run(app: Application, diContainer: interfaces.Container): void {
    const bindingDictionary = this.bindingsService.getBindingDictionary(diContainer);
    this.bindingsService.traverse(bindingDictionary, (key, value) => {
      const instance = value[0].cache;
      const type = value[0].type;
      if (!instance || !Object.getPrototypeOf(instance) || type === 'ConstantValue') {
        return;
      }
      const prototype = Object.getPrototypeOf(instance);
      this.metadataScanner.scanFromPrototype(instance, prototype, (key: string) => {
        this._lookupSchedulers(instance, prototype, key);
      });
    });
    this.schedulerOrchestrator.mountCron();
  }

  public destroy(): void {
    this.schedulerOrchestrator.closeCronJobs();
  }

  private _lookupSchedulers(
    instance: Record<string, FunctionType>,
    prototype: Record<string, any>,
    key: string,
  ): void {
    const methodRef = prototype[key];
    const cronMetadata = Reflect.getMetadata(CRON_JOB_OPTIONS, prototype[key]);
    if (cronMetadata) {
      this.schedulerOrchestrator.addOptions(methodRef.bind(instance), cronMetadata);
    }
  }
}
