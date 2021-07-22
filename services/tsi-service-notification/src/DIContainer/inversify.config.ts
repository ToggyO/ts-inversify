/**
 * Description: Dependency injection container
 * Default scope for Inversifyjs is transient
 */

import { Container, interfaces } from 'inversify';

/**
 * Application services
 */
import { IConfiguration, ConfigurationService } from 'config';
import { IApplicationStorage, IService, IServiceConfiguration } from 'interfaces';
import { NodeEnv } from 'constants/common';
import { Startup } from 'services';
import { CreateLogger } from 'services/logger';
import { ServerSettings } from 'services/common';
import { MailService } from 'services/mail';
import { QueueService } from 'services/queue';
import { ApplicationStorage } from 'utils/appStorage';
import { ILogger, ILoggerService, LocalDevLogger, ProdLogger } from 'utils/logger';
import { IMailer, Mailer } from 'utils/mailer';
import { IQueueConsumer, IQueueRegistry, IQueueService, MailQueueConsumer, QueueRegistry } from 'utils/queue';
import { Templator } from 'utils/mailer/templates/templator';
import { TemplateEngine } from 'utils/mailer/templates/engine';
import { VIEW_DIR } from 'utils/mailer/constants';

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
     * Application storage
     */
    _dIContainer
      .bind<IApplicationStorage>(TYPES.IApplicationStorage)
      .to(ApplicationStorage)
      .inSingletonScope();

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
     * Mail service
     */
    _dIContainer
      .bind<IMailer>(TYPES.IMailer)
      .toDynamicValue((context) => {
        const logger = context.container.get<ILogger>(TYPES.ILogger);
        const templator = new Templator();
        const templateEngine = new TemplateEngine(VIEW_DIR);
        return new Mailer(logger, templator, templateEngine);
      })
      .inSingletonScope();
    _dIContainer.bind<IService>(TYPES.IMailService).to(MailService).inSingletonScope();

    /**
     * Queue service
     */
    _dIContainer.bind<IQueueRegistry>(TYPES.IQueueRegistry).to(QueueRegistry).inSingletonScope();
    _dIContainer.bind<IQueueService>(TYPES.IQueueService).to(QueueService).inSingletonScope();
    _dIContainer.bind<IQueueConsumer>(TYPES.IMailConsumer).to(MailQueueConsumer).inSingletonScope();

    /**
     * Service configuration
     */
    _dIContainer.bind<IServiceConfiguration>(TYPES.IServiceConfiguration).to(Startup).inSingletonScope();

    return _dIContainer;
  }
}
