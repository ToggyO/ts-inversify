/**
 * Description: Interfaces for user category
 */

import { NextFunction, Request, Response } from 'express';
import { CreateOptions, DestroyOptions, FindOptions, UpdateOptions, BulkCreateOptions } from 'sequelize';

import {
  GetEntityPayload,
  GetEntityResponse,
  GetListResponse,
  GetParameters,
  RequestQueries,
} from 'modules/interfaces';

import { ECategoryModel } from './e-category.model';
import { CreateECategoryDTO, CreateECategoryProductDTO, UpdateECategoryDTO } from './types';
import { ECategoryProductModel } from '../e-category-product/e-category-product.model';

export interface ICategoryHandler {
  getECategories(req: Request, res: Response, next: NextFunction): Promise<void>;
  getECategoryById(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface ICategoryEntityService {
  getECategoryEntityResponse(payload: GetEntityPayload): Promise<GetEntityResponse<ECategoryModel>>;
  getECategories(query: RequestQueries): Promise<GetListResponse<ECategoryModel>>;
  getECategoryById(id: number, query: RequestQueries): Promise<GetEntityResponse<ECategoryModel>>;
}

export interface IECategoryRepository {
  getCategories(payload: GetParameters): Promise<GetListResponse<ECategoryModel>>;
  getCategory(payload: FindOptions): Promise<ECategoryModel | null>;
  createCategory(
    payload: CreateECategoryDTO,
    options?: CreateOptions<ECategoryModel>,
  ): Promise<ECategoryModel>;
  updateCategory(
    payload: Partial<UpdateECategoryDTO>,
    options: UpdateOptions<ECategoryModel>,
  ): Promise<[number, ECategoryModel[]]>;
  deleteCategory(options: DestroyOptions<ECategoryModel>): Promise<number>;
  createECategoryProductBulk(
    items: Array<CreateECategoryProductDTO>,
    options?: BulkCreateOptions<ECategoryProductModel>,
  ): Promise<Array<ECategoryProductModel>>;
}
