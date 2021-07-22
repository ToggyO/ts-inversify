/**
 * Description: Common module types and interfaces
 */

import * as express from 'express';
import { FindOptions, ModelType, Model, Includeable, OrderItem } from 'sequelize';

import { IService } from 'interfaces';
export interface IModule {
  readonly router: express.Router;
  createRouter(): express.Router;
  initializeSwagger(): void;
}

export interface IBaseRouter {
  readonly router: express.Router;
  readonly routePrefix: string;
  initRoutes(): express.Router;
}

export interface IBaseService {
  useSchema<T extends Record<string, any>, M extends ModelType>(
    values: T,
    options: UseSchemaOptions<M>,
  ): { [K in keyof T]: T[K] };
  getModelAttributes<T extends ModelType>(props: GetModelAttributesPayload<T>): Array<string>;
  getRequiredModelAttributes<T extends ModelType>(props: GetModelAttributesPayload<T>): Array<string>;
  dryPayload<T extends Record<string, any>, U extends Record<string, any>>(payload: T, schema: U): T;
  dryDataWithInclude<T extends ModelType, M extends Model>(
    props: DryDataWithIncludePayload<T, M>,
  ): DryDataWithInclude<M>;
  getPagination({ query }: { query: QueriesPagination }): GetPagination;
  getSort({ query }: { query: QueriesSort }): Array<OrderItem>;
  getInclude({ query }: { query: QueriesInclude }): Includeable | Includeable[];
  getSearch(payload: { query: QueriesSearch; fieldNames: Array<string> }): Array<Record<string, any>> | null;
}

export interface IBaseRepository {
  getPaginationResponse(
    result: { count: number },
    pagination: GetPagination | Record<string, any>,
  ): { pagination: Pagination } | Record<string, any>;
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
  QueriesSearch & {
    withTopDestination: 'true' | 'false';
    withTopToVisit: 'true' | 'false';
    withTopActivities: 'true' | 'false';
    withMostPopular: 'true' | 'false';
    isActive: 'true' | 'false';
    [key: string]: any;
  };

export type GetPagination = {
  offset: number;
  limit: number;
};

export type GetParameters = FindOptions & { pagination?: GetPagination };

export type GetListResponse<T> = {
  items: Array<T>;
  pagination?: Pagination | Record<string, any>;
};

export type GetEntityPayload = {
  id: number;
  include?: Includeable | Includeable[];
};

export type GetEntityResponse<T extends Record<string, any>> = DryDataWithInclude<T>;

export type DryDataWithIncludePayload<T extends ModelType, M extends Model> = {
  model: T;
  data: M | null;
};

export type DryDataWithInclude<T extends Record<string, any>> = T | undefined;

export type SequelizeModels = { [key: string]: any };

export type GetModelAttributesPayload<T extends ModelType> = {
  model: T;
  additionalAttributes?: Array<string>;
};

export type UseSchemaOptions<M extends ModelType> = {
  model: M;
  modelSchemaKey: string;
  callback?: (data: any) => any;
  additionalAttributes?: Array<string>;
};
