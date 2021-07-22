/**
 * Description: Main application class, create base application configuration
 */

import http, { Server } from 'http';
import path from 'path';

import { interfaces } from 'inversify';

import { AbstractApplication } from 'abstractions';
import { Startup } from 'services';
import { ConfigurationService, IConfiguration } from 'config';
import { TYPES, DependencyInjectionModule } from 'DIContainer';
import { STORAGE_KEYS } from 'constants/storage-keys';
import { ILogger } from 'utils/logger';
import { NodeEnv } from 'constants/common';
import { autobind } from 'utils/helpers';

import {
  IApplicationStorage,
  AppConstructor,
  IServiceConfiguration,
  IApplicationShutdown,
} from './interfaces';
import { ApplicationShutdown } from './exit';

export class Application extends AbstractApplication {
  protected host = '0.0.0.0';
  protected port: string | number = 5003;
  protected shutdown: IApplicationShutdown;

  protected readonly server: Server;
  protected readonly DIContainer: interfaces.Container;
  protected readonly configService: IConfiguration;
  protected readonly appStorage: IApplicationStorage;
  protected readonly services: IServiceConfiguration;

  constructor(configPath?: string) {
    super();
    autobind(this);
    this.server = http.createServer();
    this.DIContainer = new DependencyInjectionModule().load();
    if (configPath) {
      const absolutePath = path.resolve(path.join(__dirname, configPath));
      ConfigurationService.setConfigPath(absolutePath);
    }
    this.configService = this.DIContainer.get<IConfiguration>(TYPES.IConfiguration);
    this.appStorage = this.DIContainer.get<IApplicationStorage>(TYPES.IApplicationStorage);
    this.services = new Startup(this.appStorage, this.DIContainer);
    this.shutdown = new ApplicationShutdown();
  }

  protected onApplicationShutdown(server: http.Server): void {
    this.shutdown.shutdownHandler(server, this.stopServices);
  }

  public async runServices(): Promise<void> {
    await this.services.createServices();
  }

  public async stopServices(): Promise<void> {
    await this.services.destroyServices();
  }

  public get<T>(token: symbol | string): T {
    return this.DIContainer.get<T>(token);
  }

  public listen(port: number): void;
  public listen(config: AppConstructor): void;
  public listen(arg: number | AppConstructor): void {
    if (typeof arg === 'number') {
      this.port = arg;
    }

    if (typeof arg === 'object') {
      this.host = arg.host;
      this.port = arg.port;
    }

    const NODE_ENV = this.configService.get<NodeEnv>('NODE_ENV', NodeEnv.Development);

    this.server.listen({ host: this.host, port: this.port }, () => {
      const logger = this.appStorage.get<ILogger>(STORAGE_KEYS.LOGGER);
      if (logger) {
        logger.info(`Server is running at http://${this.host}:${this.port}, in ${NODE_ENV} mode.`);
      }
    });

    this.onApplicationShutdown(this.server);
  }
}
