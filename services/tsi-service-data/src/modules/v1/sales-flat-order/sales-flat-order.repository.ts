/**
 * Description: sales flat orders module repository
 */

import { CreateOptions, FindOptions, UpdateOptions, QueryTypes } from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IConnector, IDbContext } from 'db/interfaces';
import { BaseRepository } from 'modules/common';
import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, GetParameters } from 'modules/interfaces';

import { SalesFlatOrderModel } from './sales-flat-order.model';
import { ISalesFlatOrderRepository } from './interfaces';
import { BookingOfUserModel, CreateOrderDTO, RawTicketsDTO, RawTickets, UpdateOrderDTO } from './types';

@injectable()
export class SalesFlatOrderRepository extends BaseRepository implements ISalesFlatOrderRepository {
  constructor(
    @inject(TYPES.DbContext) protected readonly dbContext: IDbContext,
    @inject(TYPES.IConnector) protected readonly connector: IConnector,
  ) {
    super();
    autobind(this);
  }

  /**
   * Get list of orders
   */
  public async getOrders({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<SalesFlatOrderModel>> {
    const orders = await this.dbContext.SalesFlatOrderModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<SalesFlatOrderModel>>(orders, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: orders.count }, pagination),
    };
  }

  /**
   * Get orders
   */
  public async getOrder({
    where = {},
    attributes,
    include,
  }: FindOptions): Promise<SalesFlatOrderModel | null> {
    return this.dbContext.SalesFlatOrderModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Get list of order items by by user id
   */
  public async getBookingsByUserId(
    userId: number,
    { pagination, onlyActiveBookings = false }: GetParameters & { onlyActiveBookings?: boolean },
  ): Promise<GetListResponse<BookingOfUserModel>> {
    const sequelize = this.connector.getConnection();
    const sfoAlias = 'sfo';
    const sfoimAlias = 'sfoim';
    const prAlias = 'p';
    const limit = pagination?.limit;
    const offset = pagination?.offset;
    const withActiveBookings = onlyActiveBookings ? `AND ${sfoimAlias}.date > NOW()` : '';
    const attributes =
      `${sfoimAlias}.*,` +
      `${prAlias}.rating_avg as ratingAvg, ${prAlias}.image_url as imageUrl, ${sfoAlias}.grand_total as grandTotal`;

    const sql = (doCount = false) => `
      SELECT ${doCount ? 'COUNT(*)' : attributes}
          FROM sales_flat_orders ${sfoAlias}
          JOIN sales_flat_order_items_meta ${sfoimAlias} ON ${sfoAlias}.id = ${sfoimAlias}.order_id
          JOIN products ${prAlias} ON ${prAlias}.id = ${sfoimAlias}.product_id 
          WHERE ${sfoAlias}.user_id = :userId AND ${sfoimAlias}.is_booked > 0 ${withActiveBookings}
          LIMIT ${limit}
          OFFSET ${offset};
    `;

    const items = await sequelize!.query<BookingOfUserModel>(sql(), {
      type: QueryTypes.SELECT,
      replacements: { userId: [userId] },
    });
    const count = await sequelize!.query<{ 'COUNT(*)': number }>(sql(true), {
      type: QueryTypes.SELECT,
      replacements: { userId: [userId] },
    });

    if (!count.length) {
      count.push({ 'COUNT(*)': 0 });
    }

    return {
      items,
      ...this.getPaginationResponse(
        {
          count: count[0]['COUNT(*)'] as number,
        },
        pagination,
      ),
    };
  }

  /**
   * Get list of ordered tickets by order id
   */
  public async getTickets(orderId: number): Promise<RawTicketsDTO> {
    const sequelize = this.connector.getConnection();
    const orderUuidSql = `
      SELECT order_uuid as orderUuid, sub_total as subTotal,
      grand_total as grandTotal, gateway_charges as gatewayCharges
        FROM sales_flat_orders sfo
        WHERE sfo.id = :orderId;
    `;
    const sql = `
      SELECT p.name, sfoim.date, sfoim.time, sfoim.product_options as productOptions
        FROM sales_flat_orders sfo 
        JOIN sales_flat_order_items_meta sfoim ON sfoim.order_id = sfo.id
        JOIN products p ON p.id = sfoim.product_id
        JOIN product_details pd ON p.id = pd.product_id 
        WHERE sfo.id = :orderId;
    `;
    const orders = await sequelize!.query<SalesFlatOrderModel>(orderUuidSql, {
      type: QueryTypes.SELECT,
      replacements: { orderId },
    });
    const items = await sequelize!.query<RawTickets>(sql, {
      type: QueryTypes.SELECT,
      replacements: { orderId },
    });

    return { order: orders.length ? orders[0] : ({} as SalesFlatOrderModel), items };
  }

  /**
   * Create order
   */
  public async createOrder(
    payload: CreateOrderDTO,
    options?: CreateOptions<SalesFlatOrderModel>,
  ): Promise<SalesFlatOrderModel> {
    return this.dbContext.SalesFlatOrderModel.create({ ...payload, deviceType: 2 }, options);
  }

  /**
   * Update order
   */
  public async updateOrder(
    payload: Partial<UpdateOrderDTO>,
    options: UpdateOptions<SalesFlatOrderModel>,
  ): Promise<[number, SalesFlatOrderModel[]]> {
    return this.dbContext.SalesFlatOrderModel.update(payload, options);
  }
}
