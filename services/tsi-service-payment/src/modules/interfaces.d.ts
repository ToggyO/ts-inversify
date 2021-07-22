/**
 * Description: Common module types and interfaces
 */

import * as express from 'express';

import { IService } from 'interfaces';

export interface IModule {
  readonly router: express.Router;
  createRouter(): express.Router;
  initializeModels(args: any): any;
  initializeSwagger(args: any): any;
}

export interface IBaseRouter {
  readonly router: express.Router;
  readonly routePrefix: string;
  initRoutes(): express.Router;
}

export interface IBaseService {
  dryPayload<T extends Record<string, any>, U extends Record<string, any>>(payload: T, schema: U): T;
}
export interface IModuleService extends IService {
  readonly modules: IModule;
}

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
};
