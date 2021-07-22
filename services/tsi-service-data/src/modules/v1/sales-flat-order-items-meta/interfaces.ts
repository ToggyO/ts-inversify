/**
 * Description: Interfaces for sales flat order items meta module
 */

import { FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';

import { GetParameters, GetListResponse } from 'modules/interfaces';

import { SalesFlatOrderItemsMetaModel } from './sales-flat-order-items-meta.model';
import { CreateOrderItemDTO, UpdateOrderItemDTO } from './types';
import { BulkCreateOptions } from 'sequelize/types/lib/model';

export interface ISalesFlatOrderItemsMetaRepository {
  getOrderItems(payload: GetParameters): Promise<GetListResponse<SalesFlatOrderItemsMetaModel>>;
  getOrderItem(payload: FindOptions): Promise<SalesFlatOrderItemsMetaModel | null>;
  createOrderItem(
    payload: CreateOrderItemDTO,
    options?: CreateOptions<SalesFlatOrderItemsMetaModel>,
  ): Promise<SalesFlatOrderItemsMetaModel>;
  createOrderItemBulk(
    items: Array<CreateOrderItemDTO>,
    options?: BulkCreateOptions<SalesFlatOrderItemsMetaModel>,
  ): Promise<Array<SalesFlatOrderItemsMetaModel>>;
  updateOrderItem(
    payload: Partial<UpdateOrderItemDTO>,
    options: UpdateOptions<SalesFlatOrderItemsMetaModel>,
  ): Promise<[number, SalesFlatOrderItemsMetaModel[]]>;
  deleteOrderItem(options: DestroyOptions<SalesFlatOrderItemsMetaModel>): Promise<number>;
}
