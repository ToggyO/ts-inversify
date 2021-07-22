/**
 * Description: Sales flat order items module repository
 */

import { FindOptions, UpdateOptions, CreateOptions } from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IConnector, IDbContext } from 'db/interfaces';
import { BaseRepository } from 'modules/common';
import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, GetParameters } from 'modules/interfaces';

import { SalesFlatOrderItemModel } from './sales-flat-order-item.model';
import { ISalesFlatOrderItemsRepository } from './intefaces';
import { CreateOrderItemDTO, UpdateOrderItemDTO } from './types';

@injectable()
export class SalesFlatOrderItemsRepository extends BaseRepository implements ISalesFlatOrderItemsRepository {
  constructor(
    @inject(TYPES.DbContext) protected readonly dbContext: IDbContext,
    @inject(TYPES.IConnector) protected readonly connector: IConnector,
  ) {
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
  }: GetParameters): Promise<GetListResponse<SalesFlatOrderItemModel>> {
    const orderItems = await this.dbContext.SalesFlatOrderItemModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<SalesFlatOrderItemModel>>(orderItems, 'rows', []);
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
  }: FindOptions): Promise<SalesFlatOrderItemModel | null> {
    return this.dbContext.SalesFlatOrderItemModel.findOne({
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
    options?: CreateOptions<SalesFlatOrderItemModel>,
  ): Promise<SalesFlatOrderItemModel> {
    return this.dbContext.SalesFlatOrderItemModel.create(payload, options);
  }

  /**
   * Update order item
   */
  public async updateOrderItem(
    payload: Partial<UpdateOrderItemDTO>,
    options: UpdateOptions<SalesFlatOrderItemModel>,
  ): Promise<[number, SalesFlatOrderItemModel[]]> {
    return this.dbContext.SalesFlatOrderItemModel.update(payload, options);
  }
}
