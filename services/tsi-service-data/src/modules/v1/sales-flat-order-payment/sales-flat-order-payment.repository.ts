/**
 * Description: Sales flat order payment meta module repository
 */

import { FindOptions, UpdateOptions, CreateOptions } from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IDbContext } from 'db/interfaces';
import { BaseRepository } from 'modules/common';
import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, GetParameters } from 'modules/interfaces';

import { SalesFlatOrderPaymentModel } from './sales-flat-order-payment.model';
import { ISalesFlatOrderPaymentRepository } from './interfaces';
import { CreateOrderPaymentDTO, UpdateOrderPaymentDTO } from './types';

@injectable()
export class SalesFlatOrderPaymentRepository
  extends BaseRepository
  implements ISalesFlatOrderPaymentRepository {
  constructor(@inject(TYPES.DbContext) protected readonly dbContext: IDbContext) {
    super();
    autobind(this);
  }

  /**
   * Get list of order payments
   */
  public async getOrderPayments({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<SalesFlatOrderPaymentModel>> {
    const orderPayments = await this.dbContext.SalesFlatOrderPaymentModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<SalesFlatOrderPaymentModel>>(orderPayments, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: orderPayments.count }, pagination),
    };
  }

  /**
   * Get order payment
   */
  public async getOrderPayment({
    where = {},
    attributes,
    include,
  }: FindOptions): Promise<SalesFlatOrderPaymentModel | null> {
    return this.dbContext.SalesFlatOrderPaymentModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Create order payment
   */
  public async createOrderPayment(
    payload: CreateOrderPaymentDTO,
    options?: CreateOptions<SalesFlatOrderPaymentModel>,
  ): Promise<SalesFlatOrderPaymentModel> {
    return this.dbContext.SalesFlatOrderPaymentModel.create(payload, options);
  }

  /**
   * Update order item
   */
  public async updateOrderItem(
    payload: Partial<UpdateOrderPaymentDTO>,
    options: UpdateOptions<SalesFlatOrderPaymentModel>,
  ): Promise<[number, SalesFlatOrderPaymentModel[]]> {
    return this.dbContext.SalesFlatOrderPaymentModel.update(payload, options);
  }
}
