/**
 * Description: Main application class, create base application configuration
 */

import http from 'http';
import path from 'path';

import express from 'express';
import { interfaces } from 'inversify';

import { AbstractApplication } from 'abstractions';
import { ConfigurationService, IConfiguration } from 'config';
import { DependencyInjectionModule, TYPES } from 'DIContainer';
import { Startup } from 'services';
import { STORAGE_KEYS } from 'constants/storage-keys';
import { NodeEnv } from 'constants/node-env.enum';
import { autobind } from 'utils/helpers';

import { AppConstructor, IServiceConfiguration, IApplicationShutdown } from './interfaces';
import { ApplicationShutdown } from './exit';

export class Application extends AbstractApplication {
  protected host = '0.0.0.0';
  protected port: string | number = 5000;
  protected server: http.Server;
  protected shutdown: IApplicationShutdown;

  public readonly app: express.Application;
  public readonly DIContainer: interfaces.Container;
  public readonly configService: IConfiguration;
  public readonly services: IServiceConfiguration;

  constructor(configPath?: string) {
    super();
    autobind(this);
    this.app = express();
    this.DIContainer = new DependencyInjectionModule().load();
    if (configPath) {
      const absolutePath = path.resolve(path.join(__dirname, configPath));
      ConfigurationService.setConfigPath(absolutePath);
    }
    this.configService = this.DIContainer.get<IConfiguration>(TYPES.IConfiguration);
    this.services = new Startup(this.app, this.DIContainer);
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

    this.server = this.app.listen({ host: this.host, port: this.port }, () => {
      this.app
        .get(STORAGE_KEYS.LOGGER)
        .info(`Server is running at http://${this.host}:${this.port}, in ${NODE_ENV} mode.`);
    });

    this.onApplicationShutdown(this.server);
  }
}
