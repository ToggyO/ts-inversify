/**
 * Description: Common module types and interfaces
 */

import * as express from 'express';

import { IService } from 'interfaces';

export interface IModule {
  readonly router: express.Router;
  createRouter(): express.Router;
  initializeModels(args: any): any;
  initializeSwagger(basePath: string): express.RequestHandler;
}

export interface IBaseRouter {
  readonly router: express.Router;
  readonly routePrefix: string;
  initRoutes(): express.Router;
}

export interface IModuleService extends IService {
  readonly modules: IModule;
}

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
};

export type QueriesPagination = Pick<Pagination, 'page' & 'pageSize'>;

export type QueriesSort = {
  sort?: string | Array<string>;
};

export type QueriesFilter = {
  filter?: string | Array<string>;
};

export type QueriesInclude = {
  include?: Includeable | Includeable[];
};

export type QueriesSearch = {
  search?: string;
};

export type RequestQueries = QueriesPagination &
  QueriesSort &
  QueriesFilter &
  QueriesInclude &
  QueriesSearch & { [key: string]: any };

export type GetPagination = {
  offset: number;
  limit: number;
};

export type GetListResponse<T> = {
  items: Array<T>;
  pagination: Pagination | Record<string, any>;
};
