/**
 * Description: Base application interfaces
 */

import * as express from 'express';
import { interfaces } from 'inversify';

export interface IApplication {
  runServices(): Promise<void> | void;
  stopServices(): Promise<void>;
  get<T>(token: symbol | string): T;
  listen(port: number): void;
  listen(config: AppConstructor): void;
}

export interface IApplicationError {
  errorMessage: string;
  errorCode: string | number;
  errors: any[];
  statusCode: number | undefined;
  message?: string | undefined;
}

export interface IApplicationShutdown {
  shutdownHandler(server: http.Server, beforeExitAction: () => Promise<void>): Promise<void>;
}
export interface IService {
  [propName: string]: any;
  run(app?: express.Application, ...args: Array<any>): any;
  destroy(...args: Array<any>): void;
}

export interface IServiceConfiguration {
  createServices(): Promise<interfaces.Container>;
  destroyServices(): Promise<interfaces.Container>;
}

export type AppConstructor = {
  host: string;
  port: string | number;
};
