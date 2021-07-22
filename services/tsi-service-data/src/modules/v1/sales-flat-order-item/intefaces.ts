/**
 * Description: Interfaces for sales flat order items module
 */

import { FindOptions, CreateOptions, UpdateOptions } from 'sequelize';

import { GetParameters, GetListResponse } from 'modules/interfaces';

import { SalesFlatOrderItemModel } from './sales-flat-order-item.model';
import { CreateOrderItemDTO, UpdateOrderItemDTO } from './types';

export interface ISalesFlatOrderItemsRepository {
  getOrderItems(payload: GetParameters): Promise<GetListResponse<SalesFlatOrderItemModel>>;
  getOrderItem(payload: FindOptions): Promise<SalesFlatOrderItemModel | null>;
  createOrderItem(
    payload: CreateOrderItemDTO,
    options?: CreateOptions<SalesFlatOrderItemModel>,
  ): Promise<SalesFlatOrderItemModel>;
  updateOrderItem(
    payload: Partial<UpdateOrderItemDTO>,
    options: UpdateOptions<SalesFlatOrderItemModel>,
  ): Promise<[number, SalesFlatOrderItemModel[]]>;
}
