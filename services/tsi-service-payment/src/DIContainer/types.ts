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
  IAxiosInstanse: Symbol('IAxiosInstanse'),
  IModule: Symbol('IModule'),
  IModuleService: Symbol('IModuleService'),
  IErrorHandler: Symbol('IErrorHandler'),
  StripeApi: Symbol('StripeApi'),
  // Routers
  IBaseRouter: Symbol('IBaseRouter'),
  // Controllers
  IStripeHandler: Symbol('IStripeHandler'),
  // Module services
  IStripeService: Symbol('IStripeService'),
  // Helpers
  AsyncWrapper: Symbol('AsyncWrapper'),
};
