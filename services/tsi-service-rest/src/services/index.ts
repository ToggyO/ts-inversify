/**
 * Description: This class creates application services.
 */

import { Application } from 'express';
import { injectable, interfaces } from 'inversify';

import { AbstractStartup } from 'abstractions';
import { ICorsService, IService, ISessionService } from 'interfaces';
import { TYPES } from 'DIContainer/types';
import { ILoggerService } from 'utils/logger';
import { IModuleService } from 'modules/interfaces';
import { IGoogleAuthService } from 'utils/googleClient';
import { IQueueService } from 'utils/queue';

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
    DIContainer.get<ICorsService>(TYPES.ICorsService).run(app);
    DIContainer.get<IService>(TYPES.IRedisService).run(app);
    await DIContainer.get<IQueueService>(TYPES.IQueueService).run(app);
    DIContainer.get<ISessionService>(TYPES.ISessionService).run(app);
    DIContainer.get<IService>(TYPES.IServerSettings).run(app);
    DIContainer.get<IGoogleAuthService>(TYPES.IGoogleAuthService).run(app);
    DIContainer.get<IModuleService>(TYPES.IModuleService).run(app);
    DIContainer.get<IService>(TYPES.IErrorHandler).run(app);

    return DIContainer;
  }

  public async destroyServices(): Promise<interfaces.Container> {
    const { DIContainer } = this;

    DIContainer.get<ILoggerService>(TYPES.ILoggerService).destroy();
    DIContainer.get<ICorsService>(TYPES.ICorsService).destroy();
    DIContainer.get<IService>(TYPES.IRedisService).destroy();
    DIContainer.get<ISessionService>(TYPES.ISessionService).destroy();
    DIContainer.get<IService>(TYPES.IServerSettings).destroy();
    DIContainer.get<IGoogleAuthService>(TYPES.IGoogleAuthService).destroy();
    DIContainer.get<IModuleService>(TYPES.IModuleService).destroy();
    DIContainer.get<IService>(TYPES.IErrorHandler).destroy();
    DIContainer.get<IQueueService>(TYPES.IQueueService).destroy();

    return DIContainer;
  }
}
