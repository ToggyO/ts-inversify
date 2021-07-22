/**
 * Description: Service identifiers literals
 */

export const TYPES = {
  // Application services
  IConfiguration: Symbol('IConfiguration'),
  IApplicationStorage: Symbol('IApplicationStorage'),
  IServiceConfiguration: Symbol('IServiceConfiguration'),
  ILogger: Symbol('ILogger'),
  ILoggerService: Symbol('ILoggerService'),
  LocalDevLogger: Symbol('developmentLogger'),
  StageLogger: Symbol('stagingLogger'),
  ProdLogger: Symbol('productionLogger'),
  IFactoryOfLogger: Symbol('IFactory<Logger>'),
  IServerSettings: Symbol('IServerSettings'),
  IMailer: Symbol('IMailer'),
  IMailService: Symbol('IMailService'),
  IQueueRegistry: Symbol('IQueueRegistry'),
  IQueueService: Symbol('IQueueService'),
  IMailConsumer: Symbol('IMailConsumer'),
  // IErrorHandler: Symbol('IErrorHandler'),
};
