import { IPromoCodeHandler } from 'modules/v1/admin/promo-code/promo-code.admin.interfaces';
import { IProfileAdminHandler } from 'modules/v1/admin/profile/profile.admin.interfaces';

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
  IServerSettings: Symbol('IServerSettings'),
  IAxiosInstance: Symbol('IAxiosInstance'),
  IModule: Symbol('IModule'),
  IModuleService: Symbol('IModuleService'),
  IStaticModel: Symbol('IStaticModel'),
  ISessionStorage: Symbol('ISessionStorage'),
  ISessionService: Symbol('ISessionService'),
  ICorsService: Symbol('ICorsService'),
  IRedisConstructor: Symbol('IRedisConstructor'),
  IRedisService: Symbol('IRedisService'),
  IErrorHandler: Symbol('IErrorHandler'),
  IGoogleClient: Symbol('IGoogleClient'),
  IGoogleAuthService: Symbol('IGoogleAuthService'),
  IFacebookClient: Symbol('IFacebookClient'),
  IQueueRegistry: Symbol('IQueueRegistry'),
  IQueueService: Symbol('IQueueService'),
  IHeadoutApi: Symbol('IHeadoutApi'),
  // Routers
  IBaseRouter: Symbol('IBaseRouter'),
  // Controllers
  IAuthHandler: Symbol('IAuthHandler'),
  ICityHandler: Symbol('ICityHandler'),
  ICountryHandler: Symbol('ICountryHandler'),
  IProductHandler: Symbol('IProductHandler'),
  IProfileHandler: Symbol('IProfileHandler'),
  ICartHandler: Symbol('ICartHandler'),
  IPaymentHandler: Symbol('IPaymentHandler'),
  ICategoryHandler: Symbol('ICategoryHandler'),
  ISupportHandler: Symbol('ISupportHandler'),
  IProductAdminHandler: Symbol('IProductAdminHandler'),
  IUserAdminHandler: Symbol('IUserAdminHandler'),
  IPromoCodeHandler: Symbol('IPromoCodeHandler'),
  IAuthAdminHandler: Symbol('IAuthAdminHandler'),
  IProfileAdminHandler: Symbol('IProfileAdminHandler'),
  // Entity services
  IHeadoutService: Symbol('IHeadoutService'),
  // Helpers
  IIdentityHelpers: Symbol('IIdentityHelpers'),
  IRedisHelpers: Symbol('IRedisHelpers'),
  ICloudinaryHelpers: Symbol('ICloudinaryHelpers'),
  // Middlewares
  IFileHandler: Symbol('IFileHandler'),
  AsyncWrapper: Symbol('AsyncWrapper'),
};
