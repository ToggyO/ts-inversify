/**
 * Description: Dependency injection container
 * Default scope for Inversifyjs is transient
 */

import { Container, interfaces } from 'inversify';

import { IConfiguration, ConfigurationService } from 'config';
import { IService, IServiceConfiguration } from 'interfaces';
import { NodeEnv } from 'constants/node-env.enum';
import { Connector } from 'db';
import { DbContext } from 'db/context';
import { Startup } from 'services';
import { CreateLogger } from 'services/logger';
import { ServerSettings } from 'services/common';
import { DatabaseConnection } from 'services/db';
import { Modules } from 'services/modules';
import { SchedulerService } from 'services/schedule';
import { ErrorHandler } from 'services/errorHandler';
import { ConnectorOptions, IConnector, IDatabaseConnectionService, IDbContext } from 'db/interfaces';
import { ILogger, LocalDevLogger, ProdLogger, ILoggerService } from 'utils/logger';
import { asyncWrapper, IAsyncWrapper, autobind } from 'utils/helpers';
import { IMetadataScanner, MetadataScanner } from 'utils/metadataScanner';
import { Bindings, IBindingDictionaryService } from 'utils/bindings';
import { IThreadsPoolConstructor, ThreadsPoolConstructor } from 'utils/threads';
import {
  ISchedulerRegistry,
  SchedulerRegistry,
  ISchedulerOrchestrator,
  SchedulerOrchestrator,
  ISchedulerService,
} from 'utils/scheduler';
import { IBaseRouter, IModule, IModuleService } from 'modules/interfaces';
import { ModuleV1 } from 'modules/v1/initialize';
import {
  CityRouter,
  CityController,
  CityService,
  ICityHandler,
  ICityEntityService,
  ICityRepository,
  CityRepository,
} from 'modules/v1/city';
import {
  CountryRouter,
  CountryController,
  ICountryHandler,
  CountryService,
  ICountryEntityService,
  CountryRepository,
  ICountryRepository,
} from 'modules/v1/country';
import {
  ProductRouter,
  ProductController,
  ProductService,
  IProductHandler,
  IProductEntityService,
  IProductRepository,
  ProductRepository,
} from 'modules/v1/product';
import {
  ItineraryRouter,
  ItineraryController,
  ItineraryService,
  ItineraryRepository,
  IItineraryHandler,
  IItineraryEntityService,
  IItineraryRepository,
} from 'modules/v1/itinerary';
import {
  UserRouter,
  UserController,
  UserService,
  IUserHandler,
  IUserEntityService,
  UserRepository,
  IUserRepository,
} from 'modules/v1/user';
import { IRegistrationOtpRepository, RegistrationOtpRepository } from 'modules/v1/registration-otp';
import { IItineraryItemRepository, ItineraryItemRepository } from 'modules/v1/itinerary-item';
import {
  SalesFlatOrderRouter,
  ISalesFlatOrderHandler,
  SalesFlatOrderController,
  ISalesFlatOrderEntityService,
  SalesFlatOrderService,
  ISalesFlatOrderRepository,
  SalesFlatOrderRepository,
} from 'modules/v1/sales-flat-order';
import {
  ISalesFlatOrderItemsRepository,
  SalesFlatOrderItemsRepository,
} from 'modules/v1/sales-flat-order-item';
import {
  ISalesFlatOrderItemsMetaRepository,
  SalesFlatOrderItemsMetaRepository,
} from 'modules/v1/sales-flat-order-items-meta';
import {
  SalesFlatOrderPaymentRouter,
  ISalesFlatOrderPaymentHandler,
  SalesFlatOrderPaymentController,
  ISalesFlatOrderPaymentEntityService,
  SalesFlatOrderPaymentService,
  ISalesFlatOrderPaymentRepository,
  SalesFlatOrderPaymentRepository,
} from 'modules/v1/sales-flat-order-payment';
import {
  ECategoryRepository,
  CategoryService,
  ICategoryEntityService,
  IECategoryRepository,
  ICategoryHandler,
  CategoryController,
  CategoryRouter,
} from 'modules/v1/e-category';
import {
  IProductAdminHandler,
  IProductAdminService,
  ProductAdminController,
  ProductAdminRouter,
  ProductAdminService,
} from 'modules/v1/admin/product';
import {
  UserAdminRouter,
  IUserAdminHandler,
  IUserAdminService,
  UserAdminController,
  UserAdminService,
} from 'modules/v1/admin/user';
import {
  IPromoCodeEntityService,
  IPromoCodeRepository,
  PromoCodeRepository,
  PromoCodeService,
} from 'modules/v1/promo-code';
import {
  PromoCodeAdminRouter,
  IPromoCodeAdminService,
  IPromoCodeHandler,
  PromoCodeAdminController,
  PromoCodeAdminService,
} from 'modules/v1/admin/promo-code';
import {
  AdminUserAdminController,
  AdminUserAdminRepository,
  AdminUserAdminRouter,
  AdminUserAdminService,
  IAuthAdminHandler,
  IAuthAdminRepository,
  IAuthAdminService,
} from 'modules/v1/admin/admin-user';

import { TYPES } from './types';

export class DependencyInjectionModule {
  protected _dIContainer: interfaces.Container = new Container();

  constructor() {
    autobind(this);
  }

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
     * Metadata scanner
     */
    _dIContainer.bind<IMetadataScanner>(TYPES.IMetadataScanner).to(MetadataScanner).inTransientScope();

    /**
     * Helper service for container bindings
     */
    _dIContainer
      .bind<IBindingDictionaryService>(TYPES.IBindingDictionaryService)
      .to(Bindings)
      .inTransientScope();

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
     * Database connection service
     */
    _dIContainer.bind<IConnector>(TYPES.IConnector).to(Connector).inSingletonScope();
    _dIContainer
      .bind<interfaces.Provider<IConnector>>(TYPES.IFactoryOfDBConnection)
      .toProvider<IConnector>((context: interfaces.Context) => async (options: ConnectorOptions) => {
        const connector = context.container.get<IConnector>(TYPES.IConnector);
        await connector.init(options);
        return connector;
      });
    _dIContainer
      .bind<IDatabaseConnectionService>(TYPES.IDatabaseConnection)
      .to(DatabaseConnection)
      .inSingletonScope();

    /**
     * API module
     */
    _dIContainer.bind<IModule>(TYPES.IModule).to(ModuleV1).inSingletonScope();
    _dIContainer.bind<IModuleService>(TYPES.IModuleService).to(Modules).inSingletonScope();

    /**
     * API module routers
     */
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(CityRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(ProductRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(UserRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(CountryRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(ItineraryRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(SalesFlatOrderRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(SalesFlatOrderPaymentRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(CategoryRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(ProductAdminRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(UserAdminRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(PromoCodeAdminRouter).inSingletonScope();
    _dIContainer.bind<IBaseRouter>(TYPES.IBaseRouter).to(AdminUserAdminRouter).inSingletonScope();

    /**
     * API module controllers
     */
    _dIContainer.bind<ICityHandler>(TYPES.ICityHandler).to(CityController).inSingletonScope();
    _dIContainer.bind<ICountryHandler>(TYPES.ICountryHandler).to(CountryController).inSingletonScope();
    _dIContainer.bind<IProductHandler>(TYPES.IProductHandler).to(ProductController).inSingletonScope();
    _dIContainer.bind<IUserHandler>(TYPES.IUserHandler).to(UserController).inSingletonScope();
    _dIContainer.bind<IItineraryHandler>(TYPES.IItineraryHandler).to(ItineraryController).inSingletonScope();
    _dIContainer
      .bind<ISalesFlatOrderHandler>(TYPES.ISalesFlatOrderHandler)
      .to(SalesFlatOrderController)
      .inSingletonScope();
    _dIContainer
      .bind<ISalesFlatOrderPaymentHandler>(TYPES.ISalesFlatOrderPaymentHandler)
      .to(SalesFlatOrderPaymentController)
      .inSingletonScope();
    _dIContainer.bind<ICategoryHandler>(TYPES.ICategoryHandler).to(CategoryController).inSingletonScope();
    _dIContainer
      .bind<IProductAdminHandler>(TYPES.IProductAdminHandler)
      .to(ProductAdminController)
      .inSingletonScope();
    _dIContainer.bind<IUserAdminHandler>(TYPES.IUserAdminHandler).to(UserAdminController).inSingletonScope();
    _dIContainer
      .bind<IPromoCodeHandler>(TYPES.IPromoCodeHandler)
      .to(PromoCodeAdminController)
      .inSingletonScope();
    _dIContainer
      .bind<IAuthAdminHandler>(TYPES.IAuthAdminHandler)
      .to(AdminUserAdminController)
      .inSingletonScope();

    /**
     * API module entity services
     */
    _dIContainer.bind<ICityEntityService>(TYPES.ICityEntityService).to(CityService).inSingletonScope();
    _dIContainer
      .bind<ICountryEntityService>(TYPES.ICountryEntityService)
      .to(CountryService)
      .inSingletonScope();
    _dIContainer
      .bind<IProductEntityService>(TYPES.IProductEntityService)
      .to(ProductService)
      .inSingletonScope();
    _dIContainer.bind<IUserEntityService>(TYPES.IUserEntityService).to(UserService).inSingletonScope();
    _dIContainer
      .bind<IItineraryEntityService>(TYPES.IItineraryEntityService)
      .to(ItineraryService)
      .inSingletonScope();
    _dIContainer
      .bind<ISalesFlatOrderEntityService>(TYPES.ISalesFlatOrderEntityService)
      .to(SalesFlatOrderService)
      .inSingletonScope();
    _dIContainer
      .bind<ISalesFlatOrderPaymentEntityService>(TYPES.ISalesFlatOrderPaymentEntityService)
      .to(SalesFlatOrderPaymentService)
      .inSingletonScope();
    _dIContainer
      .bind<ICategoryEntityService>(TYPES.ICategoryEntityService)
      .to(CategoryService)
      .inSingletonScope();
    _dIContainer
      .bind<IProductAdminService>(TYPES.IProductAdminService)
      .to(ProductAdminService)
      .inSingletonScope();
    _dIContainer.bind<IUserAdminService>(TYPES.IUserAdminService).to(UserAdminService).inSingletonScope();
    _dIContainer
      .bind<IPromoCodeAdminService>(TYPES.IPromoCodeAdminService)
      .to(PromoCodeAdminService)
      .inSingletonScope();
    _dIContainer
      .bind<IAuthAdminService>(TYPES.IAuthAdminService)
      .to(AdminUserAdminService)
      .inSingletonScope();
    _dIContainer
      .bind<IPromoCodeEntityService>(TYPES.IPromoCodeEntityService)
      .to(PromoCodeService)
      .inSingletonScope();

    /**
     * API module entity repositories
     */
    _dIContainer.bind<IProductRepository>(TYPES.IProductRepository).to(ProductRepository).inSingletonScope();
    _dIContainer.bind<ICityRepository>(TYPES.ICityRepository).to(CityRepository).inSingletonScope();
    _dIContainer.bind<ICountryRepository>(TYPES.ICountryRepository).to(CountryRepository).inSingletonScope();
    _dIContainer.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
    _dIContainer
      .bind<IRegistrationOtpRepository>(TYPES.IRegistrationOtpRepository)
      .to(RegistrationOtpRepository)
      .inSingletonScope();
    _dIContainer
      .bind<IItineraryRepository>(TYPES.IItineraryRepository)
      .to(ItineraryRepository)
      .inSingletonScope();
    _dIContainer
      .bind<IItineraryItemRepository>(TYPES.IItineraryItemRepository)
      .to(ItineraryItemRepository)
      .inSingletonScope();
    _dIContainer
      .bind<ISalesFlatOrderRepository>(TYPES.ISalesFlatOrderRepository)
      .to(SalesFlatOrderRepository)
      .inSingletonScope();
    _dIContainer
      .bind<ISalesFlatOrderItemsRepository>(TYPES.ISalesFlatOrderItemsRepository)
      .to(SalesFlatOrderItemsRepository)
      .inSingletonScope();
    _dIContainer
      .bind<ISalesFlatOrderItemsMetaRepository>(TYPES.ISalesFlatOrderItemsMetaRepository)
      .to(SalesFlatOrderItemsMetaRepository)
      .inSingletonScope();
    _dIContainer
      .bind<ISalesFlatOrderPaymentRepository>(TYPES.ISalesFlatOrderPaymentRepository)
      .to(SalesFlatOrderPaymentRepository)
      .inSingletonScope();
    _dIContainer
      .bind<IECategoryRepository>(TYPES.IECategoryRepository)
      .to(ECategoryRepository)
      .inSingletonScope();
    _dIContainer
      .bind<IPromoCodeRepository>(TYPES.IPromoCodeRepository)
      .to(PromoCodeRepository)
      .inSingletonScope();
    _dIContainer
      .bind<IAuthAdminRepository>(TYPES.IAuthAdminRepository)
      .to(AdminUserAdminRepository)
      .inSingletonScope();

    /**
     * API module database context
     */
    _dIContainer.bind<IDbContext>(TYPES.DbContext).to(DbContext).inSingletonScope();

    /**
     * Error handling service
     */
    _dIContainer.bind<IService>(TYPES.IErrorHandler).to(ErrorHandler).inSingletonScope();

    /**
     * Scheduler service
     */
    _dIContainer.bind<ISchedulerRegistry>(TYPES.ISchedulerRegistry).to(SchedulerRegistry).inSingletonScope();
    _dIContainer
      .bind<ISchedulerOrchestrator>(TYPES.ISchedulerOrchestrator)
      .to(SchedulerOrchestrator)
      .inSingletonScope();
    _dIContainer.bind<ISchedulerService>(TYPES.ISchedulerService).to(SchedulerService).inSingletonScope();

    /**
     * Service configuration
     */
    _dIContainer.bind<IServiceConfiguration>(TYPES.IServiceConfiguration).to(Startup).inSingletonScope();

    /**
     * Express middleware
     */
    _dIContainer.bind<IAsyncWrapper>(TYPES.AsyncWrapper).toConstantValue(asyncWrapper);

    /**
     * Helpers
     */
    _dIContainer
      .bind<IThreadsPoolConstructor<any, any>>(TYPES.ThreadsPoolConstructor)
      .to(ThreadsPoolConstructor)
      .inTransientScope();

    return _dIContainer;
  }
}
