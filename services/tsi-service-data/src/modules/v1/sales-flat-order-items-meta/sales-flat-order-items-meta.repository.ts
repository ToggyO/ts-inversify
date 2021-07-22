/**
 * Description: Sales flat order items meta module repository
 */

import { FindOptions, UpdateOptions, CreateOptions, DestroyOptions } from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IDbContext } from 'db/interfaces';
import { BaseRepository } from 'modules/common';
import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, GetParameters } from 'modules/interfaces';

import { SalesFlatOrderItemsMetaModel } from './sales-flat-order-items-meta.model';
import { ISalesFlatOrderItemsMetaRepository } from './interfaces';
import { CreateOrderItemDTO, UpdateOrderItemDTO } from './types';
import { BulkCreateOptions } from 'sequelize/types/lib/model';

@injectable()
export class SalesFlatOrderItemsMetaRepository
  extends BaseRepository
  implements ISalesFlatOrderItemsMetaRepository {
  constructor(@inject(TYPES.DbContext) protected readonly dbContext: IDbContext) {
    super();
    autobind(this);
  }

  /**
   * Get list of order items
   */
  public async getOrderItems({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<SalesFlatOrderItemsMetaModel>> {
    const orderItems = await this.dbContext.SalesFlatOrderItemsMetaModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<SalesFlatOrderItemsMetaModel>>(orderItems, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: orderItems.count }, pagination),
    };
  }

  /**
   * Get order item
   */
  public async getOrderItem({
    where = {},
    attributes,
    include,
  }: FindOptions): Promise<SalesFlatOrderItemsMetaModel | null> {
    return this.dbContext.SalesFlatOrderItemsMetaModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Create order item
   */
  public async createOrderItem(
    payload: CreateOrderItemDTO,
    options?: CreateOptions<SalesFlatOrderItemsMetaModel>,
  ): Promise<SalesFlatOrderItemsMetaModel> {
    return this.dbContext.SalesFlatOrderItemsMetaModel.create(payload, options);
  }

  /**
   * Create multiple records of order item
   */
  public async createOrderItemBulk(
    items: Array<CreateOrderItemDTO>,
    options?: BulkCreateOptions<SalesFlatOrderItemsMetaModel>,
  ): Promise<Array<SalesFlatOrderItemsMetaModel>> {
    return this.dbContext.SalesFlatOrderItemsMetaModel.bulkCreate(items, options);
  }

  /**
   * Update order item
   */
  public async updateOrderItem(
    payload: UpdateOrderItemDTO,
    options: UpdateOptions<SalesFlatOrderItemsMetaModel>,
  ): Promise<[number, SalesFlatOrderItemsMetaModel[]]> {
    return this.dbContext.SalesFlatOrderItemsMetaModel.update(payload, options);
  }

  /**
   * Update order item
   */
  public async deleteOrderItem(options: DestroyOptions<SalesFlatOrderItemsMetaModel>): Promise<number> {
    return this.dbContext.SalesFlatOrderItemsMetaModel.destroy(options);
  }
}
