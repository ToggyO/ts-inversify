import { IPromoCodeEntityService } from 'modules/v1/promo-code';

/**
 * Description: Service identifiers literals
 */

export const TYPES = {
  // Application services
  IConfiguration: Symbol('IConfiguration'),
  IServiceConfiguration: Symbol('IServiceConfiguration'),
  ILogger: Symbol('ILogger'),
  ILoggerService: Symbol('ILoggerService'),
  LocalDevLogger: Symbol('developmentLogger'),
  StageLogger: Symbol('stagingLogger'),
  ProdLogger: Symbol('productionLogger'),
  IFactoryOfLogger: Symbol('IFactory<Logger>'),
  IServerSettings: Symbol('IServerSettings'),
  IConnector: Symbol('IConnector'),
  IFactoryOfDBConnection: Symbol('IFactory<IConnector>'),
  IDatabaseConnection: Symbol('IDatabaseConnection'),
  IModule: Symbol('IModule'),
  IModuleService: Symbol('IModuleService'),
  ISchedulerRegistry: Symbol('ISchedulerRegistry'),
  ISchedulerOrchestrator: Symbol('ISchedulerOrchestrator'),
  ICron: Symbol('ICron'),
  ISchedulerService: Symbol('ISchedulerService'),
  IErrorHandler: Symbol('IErrorHandler'),
  IMetadataScanner: Symbol('IMetadataScanner'),
  IBindingDictionaryService: Symbol('IBindingDictionaryService'),
  // Routers
  IBaseRouter: Symbol('IBaseRouter'),
  // Controllers
  ICityHandler: Symbol('ICityHandler'),
  ICountryHandler: Symbol('ICountryHandler'),
  IProductHandler: Symbol('IProductHandler'),
  IUserHandler: Symbol('IUserHandler'),
  IItineraryHandler: Symbol('IItineraryHandler'),
  ISalesFlatOrderHandler: Symbol('ISalesFlatOrderHandler'),
  ISalesFlatOrderPaymentHandler: Symbol('ISalesFlatOrderPaymentHandler'),
  ICategoryHandler: Symbol('ICategoryHandler'),
  IProductAdminHandler: Symbol('IProductAdminHandler'),
  IUserAdminHandler: Symbol('IUserAdminHandler'),
  IPromoCodeHandler: Symbol('IPromoCodeHandler'),
  IAuthAdminHandler: Symbol('IAuthAdminHandler'),
  // Entity services
  ICityEntityService: Symbol('ICityEntityService'),
  ICountryEntityService: Symbol('ICountryEntityService'),
  IProductEntityService: Symbol('IProductEntityService'),
  IUserEntityService: Symbol('IUserEntityService'),
  IItineraryEntityService: Symbol('IItineraryEntityService'),
  ISalesFlatOrderEntityService: Symbol('ISalesFlatOrderEntityService'),
  ISalesFlatOrderPaymentEntityService: Symbol('ISalesFlatOrderPaymentEntityService'),
  ICategoryEntityService: Symbol('ICategoryEntityService'),
  IPromoCodeEntityService: Symbol('IPromoCodeAdminService'),
  IProductAdminService: Symbol('IProductAdminService'),
  IUserAdminService: Symbol('IUserAdminService'),
  IPromoCodeAdminService: Symbol('IPromoCodeAdminService'),
  IAuthAdminService: Symbol('IAuthAdminService'),
  // Entity repositories
  IProductRepository: Symbol('IProductRepository'),
  ICityRepository: Symbol('ICityRepository'),
  ICountryRepository: Symbol('ICountryRepository'),
  IUserRepository: Symbol('IUserRepository'),
  IRegistrationOtpRepository: Symbol('IRegistrationOtpRepository'),
  IItineraryRepository: Symbol('IItineraryRepository'),
  IItineraryItemRepository: Symbol('IItineraryItemRepository'),
  ISalesFlatOrderRepository: Symbol('ISalesFlatOrderRepository'),
  ISalesFlatOrderItemsRepository: Symbol('ISalesFlatOrderItemsRepository'),
  ISalesFlatOrderItemsMetaRepository: Symbol('ISalesFlatOrderItemsMetaRepository'),
  ISalesFlatOrderPaymentRepository: Symbol('ISalesFlatOrderPaymentRepository'),
  IECategoryRepository: Symbol('IECategoryRepository'),
  IPromoCodeRepository: Symbol('IPromoCodeRepository'),
  IAuthAdminRepository: Symbol('IAuthAdminRepository'),
  // Database context
  DbContext: Symbol('DbContext'),
  // Express middleware
  AsyncWrapper: Symbol('AsyncWrapper'),
  // Helpers
  ThreadsPoolConstructor: Symbol('ThreadsPoolConstructor'),
};
