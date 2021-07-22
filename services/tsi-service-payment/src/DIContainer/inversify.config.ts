/**
 * Description: Dependency injection container
 * Default scope for Inversifyjs is transient
 */

import { Container, interfaces } from 'inversify';

/**
 * Application services
 */
import { IConfiguration, ConfigurationService } from 'config';
import { IService, IServiceConfiguration } from 'interfaces';
import { NodeEnv } from 'constants/node-env.enum';
import { Startup } from 'services';
import { CreateLogger } from 'services/logger';
import { ErrorHandler } from 'services/errorHandler';
import { ServerSettings } from 'services/common';
import { Modules } from 'services/modules';
import { ModuleV1 } from 'modules/v1/initialize';
import { ILogger, LocalDevLogger, ProdLogger, ILoggerService } from 'utils/logger';
import { IBaseRouter, IModule, IModuleService } from 'modules/interfaces';
import { IPaymentApi, StripeApi } from 'utils/payment';

/**
 * Application request handlers
 */
import {
  StripeRouter,
  IStripeHandler,
  StripeController,
  IStripeService,
  StripeService,
} from 'modules/v1/stripe';

/**
 * Application middleware
 */
import { asyncWrapper, IAsyncWrapper } from 'utils/helpers';

import { TYPES } from './types';

export class DependencyInjectionModule {
  protected _dIContainer: interfaces.Container = new Container();

  get DIContainer(): interfaces.Container {
    return this._dIContainer;
  }

  public load(): interfaces.Container {
    const { _dIContainer } = this;

    /**
     * Application configuration
     */
    _dIContainer.bind<IConfiguration>(TYPES.IConfiguration).to(ConfigurationService).inSingletonScope();

    /**
     * Logger service
     */
    _dIContainer.bind<ILogger>(TYPES.LocalDevLogger).to(LocalDevLogger).inSingletonScope();
    _dIContainer.bind<ILogger>(TYPES.StageLogger).to(ProdLogger).inSingletonScope();
    _dIContainer.bind<ILogger>(TYPES.ProdLogger).to(ProdLogger).inSingletonScope();
    _dIContainer.bind<ILogger>(TYPES.ILogger).toDynamicValue((context: interfaces.Context) => {
      const { NODE_ENV } = process.env;
      let logger: ILogger;

      switch (NODE_ENV) {
        case NodeEnv.Production:
          logger = context.container.get<ILogger>(TYPES.ProdLogger);
          break;
        case NodeEnv.Staging:
          logger = context.container.get<ILogger>(TYPES.StageLogger);
          break;
        default:
          logger = context.container.get<ILogger>(TYPES.LocalDevLogger);
          break;
      }

      return logger;
    });
    _dIContainer.bind<ILoggerService>(TYPES.ILoggerService).to(CreateLogger).inSingletonScope();

    /**
     * Common server settings service
     */
    _dIContainer.bind<IService>(TYPES.IServerSettings).to(ServerSettings).inSingletonScope();

    /**
     * Error handling service
     */
    _dIContainer.bind<IService>(TYPES.IErrorHandler).to(ErrorHandler).inSingletonScope();

    /**
     * Service configuration
     */
    _dIContainer.bind<IServiceConfiguration>(TYPES.IServiceConfiguration).to(Startup).inSingletonScope();

    /**
     * API module
     */
    _dIContainer.bind<IModule>(TYPES.IModule).to(ModuleV1).inSingletonScope();
    _dIContainer.bind<IModuleService>(TYPES.IModuleService).to(Modules).inSingletonScope();

    /**
     * API module routers
     */
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(StripeRouter).inSingletonScope();

    /**
     * API module controllers
     */
    _dIContainer.bind<IStripeHandler>(TYPES.IStripeHandler).to(StripeController).inSingletonScope();

    /**
     * API module entity services
     */
    _dIContainer.bind<IStripeService>(TYPES.IStripeService).to(StripeService).inSingletonScope();

    /**
     * Stripe payment api module
     */
    _dIContainer.bind<IPaymentApi>(TYPES.StripeApi).to(StripeApi).inSingletonScope();

    /**
     * Express middleware
     */
    _dIContainer.bind<IAsyncWrapper>(TYPES.AsyncWrapper).toConstantValue(asyncWrapper);

    return _dIContainer;
  }
}
