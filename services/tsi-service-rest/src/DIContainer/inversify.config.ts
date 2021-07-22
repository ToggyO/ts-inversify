/**
 * Description: Dependency injection container
 * Default scope for Inversifyjs is transient
 */

import { Container, interfaces } from 'inversify';
import { AxiosInstance } from 'axios';
import { Multer } from 'multer';

/**
 * Application services
 */
import { IConfiguration, ConfigurationService } from 'config';
import { ICorsService, IService, IServiceConfiguration, ISessionService } from 'interfaces';
import { NodeEnv } from 'constants/node-env.enum';
import { Startup } from 'services';
import { CorsService } from 'services/cors';
import { RedisService } from 'services/redis';
import { SessionService } from 'services/session';
import { CreateLogger } from 'services/logger';
import { ServerSettings } from 'services/common';
import { Modules } from 'services/modules';
import { ErrorHandler } from 'services/errorHandler';
import { GoogleAuthService } from 'services/google';
import { QueueService } from 'services/queue';
import { ModuleV1 } from 'modules/v1/initialize';
import { IRedisConstructor, IRedisHelpers, RedisConstructor, RedisHelpers } from 'utils/redis';
import { AxiosClient } from 'utils/network';
import { ILogger, LocalDevLogger, ProdLogger, ILoggerService } from 'utils/logger';
import { IBaseRouter, IModule, IModuleService } from 'modules/interfaces';
import { GoogleClient, IGoogleAuthService, IGoogleClient } from 'utils/googleClient';
import { FacebookClient, IFacebookClient } from 'utils/facebookClient';
import { IQueueRegistry, IQueueService, QueueRegistry } from 'utils/queue';
import { IdentityHelpers, IIdentityHelpers } from 'utils/authentication';
import { HeadoutApi, IHeadoutApi } from 'utils/headout';
import { ICloudinaryHelpers, CloudinaryHelpers } from 'utils/cloudinary';

/**
 * Application request handlers
 */
import { AuthRouter, AuthController, IAuthHandler } from 'modules/v1/auth';
import { CityRouter, CityController, ICityHandler } from 'modules/v1/city';
import { CountryRouter, CountryController, ICountryHandler } from 'modules/v1/country';
import { ProductRouter, ProductController, IProductHandler } from 'modules/v1/product';
import { ProfileRouter, ProfileController, IProfileHandler } from 'modules/v1/profile';
import { CartRouter, CartController, ICartHandler } from 'modules/v1/cart';
import { HeadoutService, IHeadoutService } from 'modules/v1/headout';
import { PaymentRouter, IPaymentHandler, PaymentController } from 'modules/v1/payment';
import { ICategoryHandler, CategoryController, CategoryRouter } from 'modules/v1/category';
import { ISupportHandler, SupportController, SupportRouter } from 'modules/v1/support';
import { ProductAdminController, IProductAdminHandler, ProductAdminRouter } from 'modules/v1/admin/product';
import { IUserAdminHandler, UserAdminController, UserAdminRouter } from 'modules/v1/admin/user';
import {
  IPromoCodeHandler,
  PromoCodeAdminRouter,
  PromoCodeAdminController,
} from 'modules/v1/admin/promo-code';
import { AuthAdminRouter, IAuthAdminHandler, AuthAdminController } from 'modules/v1/admin/auth';
import { IProfileAdminHandler, ProfileAdminController, ProfileAdminRouter } from 'modules/v1/admin/profile';

/**
 * Application middleware
 */
import { asyncWrapper, IAsyncWrapper } from 'utils/helpers';
import { IFileHandler, MulterFileHandler } from 'utils/fileHandle';

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
     * Data transfer service
     */
    _dIContainer.bind<AxiosInstance>(TYPES.IAxiosInstance).toConstantValue(new AxiosClient().getAxios());

    /**
     * Error handling service
     */
    _dIContainer.bind<IService>(TYPES.IErrorHandler).to(ErrorHandler).inSingletonScope();

    /**
     * Redis service
     */
    _dIContainer.bind<IRedisConstructor>(TYPES.IRedisConstructor).to(RedisConstructor).inRequestScope();
    _dIContainer.bind<IRedisHelpers>(TYPES.IRedisHelpers).to(RedisHelpers).inSingletonScope();
    _dIContainer.bind<IService>(TYPES.IRedisService).to(RedisService);

    /**
     * Queue service
     */
    _dIContainer.bind<IQueueRegistry>(TYPES.IQueueRegistry).to(QueueRegistry).inSingletonScope();
    _dIContainer.bind<IQueueService>(TYPES.IQueueService).to(QueueService).inSingletonScope();

    /**
     * Session service
     */
    _dIContainer.bind<ISessionService>(TYPES.ISessionService).to(SessionService).inSingletonScope();

    /**
     * Cors service
     */
    _dIContainer.bind<ICorsService>(TYPES.ICorsService).to(CorsService).inSingletonScope();

    /**
     * Google API client service
     */
    _dIContainer.bind<IGoogleClient>(TYPES.IGoogleClient).to(GoogleClient).inSingletonScope();
    _dIContainer.bind<IGoogleAuthService>(TYPES.IGoogleAuthService).to(GoogleAuthService).inSingletonScope();

    /**
     * Facebook API client
     */
    _dIContainer.bind<IFacebookClient>(TYPES.IFacebookClient).to(FacebookClient).inRequestScope();

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
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(ProductRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(CityRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(CountryRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(AuthRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(ProfileRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(CartRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(PaymentRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(CategoryRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(SupportRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(ProductAdminRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(UserAdminRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(UserAdminRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(PromoCodeAdminRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(AuthAdminRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(ProfileAdminRouter).inSingletonScope();

    /**
     * API module controllers
     */
    _dIContainer.bind<IAuthHandler>(TYPES.IAuthHandler).to(AuthController).inSingletonScope();
    _dIContainer.bind<ICityHandler>(TYPES.ICityHandler).to(CityController).inSingletonScope();
    _dIContainer.bind<ICountryHandler>(TYPES.ICountryHandler).to(CountryController).inSingletonScope();
    _dIContainer.bind<IProductHandler>(TYPES.IProductHandler).to(ProductController).inSingletonScope();
    _dIContainer.bind<IProfileHandler>(TYPES.IProfileHandler).to(ProfileController).inSingletonScope();
    _dIContainer.bind<ICartHandler>(TYPES.ICartHandler).to(CartController).inSingletonScope();
    _dIContainer.bind<IPaymentHandler>(TYPES.IPaymentHandler).to(PaymentController).inSingletonScope();
    _dIContainer.bind<ICategoryHandler>(TYPES.ICategoryHandler).to(CategoryController).inSingletonScope();
    _dIContainer.bind<ISupportHandler>(TYPES.ISupportHandler).to(SupportController).inSingletonScope();
    _dIContainer
      .bind<IProductAdminHandler>(TYPES.IProductAdminHandler)
      .to(ProductAdminController)
      .inSingletonScope();
    _dIContainer.bind<IUserAdminHandler>(TYPES.IUserAdminHandler).to(UserAdminController).inSingletonScope();
    _dIContainer
      .bind<IPromoCodeHandler>(TYPES.IPromoCodeHandler)
      .to(PromoCodeAdminController)
      .inSingletonScope();
    _dIContainer.bind<IAuthAdminHandler>(TYPES.IAuthAdminHandler).to(AuthAdminController).inSingletonScope();
    _dIContainer
      .bind<IProfileAdminHandler>(TYPES.IProfileAdminHandler)
      .to(ProfileAdminController)
      .inSingletonScope();

    /**
     * API module entity services
     */
    _dIContainer.bind<IHeadoutService>(TYPES.IHeadoutService).to(HeadoutService).inSingletonScope();

    /**
     * Helpers
     */
    _dIContainer.bind<IIdentityHelpers>(TYPES.IIdentityHelpers).to(IdentityHelpers).inRequestScope();
    _dIContainer.bind<IHeadoutApi>(TYPES.IHeadoutApi).to(HeadoutApi).inRequestScope();
    _dIContainer.bind<ICloudinaryHelpers>(TYPES.ICloudinaryHelpers).to(CloudinaryHelpers).inTransientScope();

    /**
     * Express middleware
     */
    _dIContainer.bind<IAsyncWrapper>(TYPES.AsyncWrapper).toConstantValue(asyncWrapper);
    _dIContainer.bind<IFileHandler<Multer>>(TYPES.IFileHandler).to(MulterFileHandler).inTransientScope();

    return _dIContainer;
  }
}
