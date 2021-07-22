/**
 * Description: Base application interfaces
 */

import { interfaces } from 'inversify';

export interface IApplication {
  runServices(): Promise<void> | void;
  stopServices(): Promise<void>;
  get<T>(token: symbol | string): T;
  listen(port: number): void;
  listen(config: AppConstructor): void;
}

export interface IApplicationShutdown {
  shutdownHandler(server: http.Server, beforeExitAction: () => Promise<void>): Promise<void>;
}

export interface IService {
  [propName: string]: any;
  run(appStorage: IApplicationStorage, ...args: Array<any>): void;
  destroy(...args: Array<any>): void;
}

export interface IApplicationStorage {
  set<TValue = any>(key: string, value: TValue): void;
  get<TValue = any>(key: string): TValue | null;
  getStoredItemsCount(): number;
}

export type AppConstructor = {
  host: string;
  port: string | number;
};

export interface IServiceConfiguration {
  createServices(): Promise<interfaces.Container>;
  destroyServices(): Promise<interfaces.Container>;
}
