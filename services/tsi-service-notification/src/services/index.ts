/**
 * Description: This class creates application services.
 * Inject your service into constructor, then pass to 'addService' method method as parameter
 */

import { injectable, interfaces } from 'inversify';

import { AbstractStartup } from 'abstractions';
import { IService, IApplicationStorage } from 'interfaces';
import { TYPES } from 'DIContainer/types';
import { ILoggerService } from 'utils/logger';
import { IQueueService } from 'utils/queue';

@injectable()
export class Startup extends AbstractStartup {
  protected readonly appStorage: IApplicationStorage;
  protected readonly DIContainer: interfaces.Container;

  constructor(appStorage: IApplicationStorage, dIContainer: interfaces.Container) {
    super();
    this.appStorage = appStorage;
    this.DIContainer = dIContainer;
  }

  public async createServices(): Promise<interfaces.Container> {
    const { appStorage, DIContainer } = this;

    DIContainer.get<ILoggerService>(TYPES.ILoggerService).run(appStorage);
    DIContainer.get<IService>(TYPES.IServerSettings).run(appStorage);
    DIContainer.get<IService>(TYPES.IMailService).run(appStorage);
    await DIContainer.get<IQueueService>(TYPES.IQueueService).run(appStorage);

    return DIContainer;
  }

  public async destroyServices(): Promise<interfaces.Container> {
    const { DIContainer } = this;

    DIContainer.get<ILoggerService>(TYPES.ILoggerService).destroy();
    DIContainer.get<IService>(TYPES.IServerSettings).destroy();
    DIContainer.get<IService>(TYPES.IMailService).destroy();
    DIContainer.get<IQueueService>(TYPES.IQueueService).destroy();

    return DIContainer;
  }
}
