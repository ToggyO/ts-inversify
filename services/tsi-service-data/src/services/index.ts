/**
 * Description: This class creates application services.
 */

import { Application } from 'express';
import { injectable, interfaces } from 'inversify';

import { AbstractStartup } from 'abstractions';
import { IService } from 'interfaces';
import { TYPES } from 'DIContainer/types';
import { IDatabaseConnectionService } from 'db/interfaces';
import { ILoggerService } from 'utils/logger';
import { IModuleService } from 'modules/interfaces';
import { ISchedulerService } from 'utils/scheduler';

@injectable()
export class Startup extends AbstractStartup {
  protected readonly app: Application;
  protected readonly DIContainer: interfaces.Container;

  constructor(app: Application, dIContainer: interfaces.Container) {
    super();
    this.app = app;
    this.DIContainer = dIContainer;
  }

  public async createServices(): Promise<interfaces.Container> {
    const { app, DIContainer } = this;

    DIContainer.get<ILoggerService>(TYPES.ILoggerService).run(app);
    DIContainer.get<IService>(TYPES.IServerSettings).run(app);
    await DIContainer.get<IDatabaseConnectionService>(TYPES.IDatabaseConnection).run(app);
    DIContainer.get<IModuleService>(TYPES.IModuleService).run(app);
    DIContainer.get<ISchedulerService>(TYPES.ISchedulerService).run(app, DIContainer);
    DIContainer.get<IService>(TYPES.IErrorHandler).run(app);

    return DIContainer;
  }

  public async destroyServices(): Promise<interfaces.Container> {
    const { DIContainer } = this;

    DIContainer.get<ILoggerService>(TYPES.ILoggerService).destroy();
    DIContainer.get<IService>(TYPES.IServerSettings).destroy();
    DIContainer.get<IDatabaseConnectionService>(TYPES.IDatabaseConnection).destroy();
    DIContainer.get<IModuleService>(TYPES.IModuleService).destroy();
    DIContainer.get<ISchedulerService>(TYPES.ISchedulerService).destroy();
    DIContainer.get<IService>(TYPES.IErrorHandler).destroy();

    return DIContainer;
  }
}
