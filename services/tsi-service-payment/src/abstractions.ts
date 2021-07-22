/**
 * Description: Abstractions of main application classes
 */

import http from 'http';
import * as express from 'express';
import { interfaces } from 'inversify';

import { IConfiguration } from './config';
import { IApplication, AppConstructor, IServiceConfiguration, IApplicationShutdown } from './interfaces';

export abstract class AbstractApplication implements IApplication {
  protected abstract host: string;
  protected abstract port: string | number;
  protected abstract server: http.Server;
  protected abstract shutdown: IApplicationShutdown;

  protected abstract readonly app: express.Application;
  protected abstract readonly DIContainer: interfaces.Container;
  protected abstract readonly configService: IConfiguration;
  protected abstract readonly services: IServiceConfiguration;

  protected abstract onApplicationShutdown(server: http.Server): void;
  public abstract runServices(): Promise<void>;
  public abstract stopServices(): Promise<void>;
  public abstract get<T>(token: symbol | string): T;
  public abstract listen(port: number): void;
  public abstract listen(config: AppConstructor): void;
}

export abstract class AbstractStartup implements IServiceConfiguration {
  protected abstract readonly app: express.Application;
  protected abstract readonly DIContainer: interfaces.Container;

  public abstract createServices(): Promise<interfaces.Container>;
  public abstract destroyServices(): Promise<interfaces.Container>;
}
