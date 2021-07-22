/**
 * Description: E-Category module repository
 */

import { CreateOptions, FindOptions, UpdateOptions, DestroyOptions, BulkCreateOptions } from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IConnector, IDbContext } from 'db/interfaces';
import { BaseRepository } from 'modules/common';
import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, GetParameters } from 'modules/interfaces';

import { IECategoryRepository } from './interfaces';
import { ECategoryModel } from './e-category.model';
import { CreateECategoryDTO, CreateECategoryProductDTO, UpdateECategoryDTO } from './types';
import { ECategoryProductModel } from '../e-category-product/e-category-product.model';

@injectable()
export class ECategoryRepository extends BaseRepository implements IECategoryRepository {
  constructor(
    @inject(TYPES.DbContext) protected readonly dbContext: IDbContext,
    @inject(TYPES.IConnector) protected readonly connector: IConnector,
  ) {
    super();
    autobind(this);
  }

  /**
   * Get list of e-categories
   */
  public async getCategories({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<ECategoryModel>> {
    const orders = await this.dbContext.ECategoryModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<ECategoryModel>>(orders, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: orders.count }, pagination),
    };
  }

  /**
   * Get orders
   */
  public async getCategory({ where = {}, attributes, include }: FindOptions): Promise<ECategoryModel | null> {
    return this.dbContext.ECategoryModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Create category
   */
  public async createCategory(
    payload: CreateECategoryDTO,
    options?: CreateOptions<ECategoryModel>,
  ): Promise<ECategoryModel> {
    return this.dbContext.ECategoryModel.create({ ...payload, deviceType: 2 }, options);
  }

  /**
   * Update category
   */
  public async updateCategory(
    payload: Partial<UpdateECategoryDTO>,
    options: UpdateOptions<ECategoryModel>,
  ): Promise<[number, ECategoryModel[]]> {
    return this.dbContext.ECategoryModel.update(payload, options);
  }

  /**
   * Delete category
   */
  public async deleteCategory(options: DestroyOptions<ECategoryModel>): Promise<number> {
    return this.dbContext.ECategoryModel.destroy(options);
  }

  /**
   * Create e_category_product (Bulk)
   */
  public async createECategoryProductBulk(
    items: Array<CreateECategoryProductDTO>,
    options?: BulkCreateOptions<ECategoryProductModel>,
  ): Promise<Array<ECategoryProductModel>> {
    return this.dbContext.ECategoryProductModel.bulkCreate(items, options);
  }
}
