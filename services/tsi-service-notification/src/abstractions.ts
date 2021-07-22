import { Server } from 'http';
import { interfaces } from 'inversify';

import { IConfiguration } from './config';
import {
  IApplication,
  AppConstructor,
  IServiceConfiguration,
  IApplicationStorage,
  IApplicationShutdown,
} from './interfaces';

export abstract class AbstractApplication implements IApplication {
  protected abstract host: string;
  protected abstract port: string | number;
  protected shutdown: IApplicationShutdown;

  protected abstract server: Server;
  protected abstract DIContainer: interfaces.Container;
  protected abstract configService: IConfiguration;
  protected abstract appStorage: IApplicationStorage;
  protected abstract services: IServiceConfiguration;

  protected abstract onApplicationShutdown(server: Server): void;
  public abstract runServices(): Promise<void>;
  public abstract stopServices(): Promise<void>;
  public abstract get<T>(token: symbol | string): T;
  public abstract listen(port: number): void;
  public abstract listen(config: AppConstructor): void;
}

export abstract class AbstractStartup implements IServiceConfiguration {
  protected abstract readonly appStorage: IApplicationStorage;
  protected abstract readonly DIContainer: interfaces.Container;

  public abstract createServices(): Promise<interfaces.Container>;
  public abstract destroyServices(): Promise<interfaces.Container>;
}
