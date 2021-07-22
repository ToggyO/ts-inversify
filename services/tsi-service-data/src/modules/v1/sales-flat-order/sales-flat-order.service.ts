/**
 * Description: Sales flat orders module service
 */

import { Op, Transaction } from 'sequelize';
import { iterate } from 'iterare';
import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IConnector } from 'db/interfaces';
import { BaseService } from 'modules/common';
import { GetEntityPayload, GetEntityResponse, GetListResponse, RequestQueries } from 'modules/interfaces';
import { ApplicationError } from 'utils/response';
import { autobind, safelyJsonParse } from 'utils/helpers';
import { ORDER_STATUSES } from 'constants/order-statuses';
import { ERROR_CODES } from 'constants/error-codes';
import { AgeGroupOptions, IItineraryEntityService } from 'modules/v1/itinerary';
import { IProductRepository } from 'modules/v1/product';

import { SalesFlatOrderModel } from './sales-flat-order.model';
import { SalesFlatOrderValidator } from './sales-flat-order.validator';
import { ISalesFlatOrderEntityService, ISalesFlatOrderRepository } from './interfaces';
import {
  BookingOfUserDTO,
  BookingOfUserModel,
  BookOrderItemsUpdateOrderPayload,
  CreateOrderDTO,
  CreateOrderPayload,
  ExtendedBookingMeta,
  OrderDetailsDTO,
  SalesFlatOrderModelType,
  Tickets,
  TicketsDTO,
  UpdateOrderDTO,
} from './types';
import { SFO_ERROR_MESSAGES } from './constants';
import {
  CreateOrderItemDTO,
  ISalesFlatOrderItemsMetaRepository,
  SalesFlatOrderItemsMetaModel,
} from '../sales-flat-order-items-meta';
import { ItineraryItemModel } from '../itinerary-item';
import { DiscountDTO, IPromoCodeEntityService } from '../promo-code';
import { PromoCodeTypes } from 'constants/common';
import { CustomersIds } from 'modules/v1/user';

@injectable()
export class SalesFlatOrderService extends BaseService implements ISalesFlatOrderEntityService {
  constructor(
    @inject(TYPES.IConnector) protected readonly connector: IConnector,
    @inject(TYPES.ISalesFlatOrderRepository) protected readonly ordersRepository: ISalesFlatOrderRepository,
    @inject(TYPES.ISalesFlatOrderItemsMetaRepository)
    protected readonly orderItemsMetaRepository: ISalesFlatOrderItemsMetaRepository,
    @inject(TYPES.IItineraryEntityService) protected readonly itineraryService: IItineraryEntityService,
    @inject(TYPES.IProductRepository) protected readonly productRepository: IProductRepository,
    @inject(TYPES.IPromoCodeEntityService) protected readonly _promoCodeService: IPromoCodeEntityService,
  ) {
    super();
    autobind(this);
  }

  /**
   * Get a product as a common answer
   * on operations of creating / editing / getting by id
   */
  public async getEntityResponse({
    id,
    include,
  }: GetEntityPayload): Promise<GetEntityResponse<SalesFlatOrderModel>> {
    const model = SalesFlatOrderModel;
    const attributes = this.getModelAttributes<SalesFlatOrderModelType>({ model });
    const result = await this.ordersRepository.getOrder({
      where: { id },
      attributes,
      include,
    });

    return this.dryDataWithInclude({ model, data: result });
  }

  /**
   * Get list of orders
   */
  public async getOrders(query: RequestQueries): Promise<GetListResponse<SalesFlatOrderModel>> {
    const pagination = this.getPagination({ query });
    const attributes = this.getModelAttributes<SalesFlatOrderModelType>({ model: SalesFlatOrderModel });
    return this.ordersRepository.getOrders({
      attributes,
      pagination,
    });
  }

  /**
   * Get orders by id
   */
  public async getOrderById(
    id: number,
    query: RequestQueries,
  ): Promise<GetEntityResponse<SalesFlatOrderModel>> {
    const include = this.getInclude({ query });
    return this.getEntityResponse({ id, include });
  }

  /**
   * Get list of order items by by user id
   */
  public async getBookingsByUserId(
    userId: number,
    query: RequestQueries,
  ): Promise<GetListResponse<BookingOfUserModel>> {
    const pagination = this.getPagination({ query });
    const onlyActiveBookings = query['onlyActiveBookings'] === 'true';
    const orderItems = await this.ordersRepository.getBookingsByUserId(userId, {
      pagination,
      onlyActiveBookings,
    });

    orderItems.items = iterate<BookingOfUserModel>(orderItems.items)
      .map<BookingOfUserDTO>((item) => {
        const productOptions = safelyJsonParse<Array<AgeGroupOptions>>(item['product_options'], []);
        return {
          ...item,
          ['product_options']: productOptions,
        } as BookingOfUserDTO;
      })
      .toArray();

    return orderItems;
  }

  /**
   * Create sales order with items
   */
  public async createSalesFlatOrderWithItems(dto: CreateOrderPayload): Promise<number> {
    const driedValues = this.dryPayload<CreateOrderPayload>(dto, this.createOrderPayloadSchema());
    if (!driedValues.userId && !driedValues.guestId) {
      this.throwIdentityError();
    }

    SalesFlatOrderValidator.createOrderValidator(driedValues);

    const { userId, guestId, ...rest } = driedValues;

    const itinerary = await this.itineraryService.getItineraryWithItems({ userId, guestId });
    if (!itinerary || !itinerary?.itemsOfItineraries?.length) {
      throw new ApplicationError({
        statusCode: 404,
        errorCode: ERROR_CODES.not_found,
        errorMessage: SFO_ERROR_MESSAGES.NOT_FOUND('Products'),
        errors: [],
      });
    }
    const orders = await this.ordersRepository.getOrders({
      where: {
        ...(userId ? { userId } : { guestId }),
        itineraryId: itinerary.id,
        status: {
          [Op.ne]: ORDER_STATUSES.CONFIRMED,
        },
      },
      include: ['orderItemsMeta', 'orderPayment'],
      order: [['updatedAt', 'DESC']],
    });

    let discountDto: DiscountDTO | null = null;
    let order = orders.items[0];
    const subTotal = this._createSubTotal(itinerary.itemsOfItineraries);
    if (driedValues.promoCode) {
      discountDto = await this._promoCodeService.getDiscountPercent(driedValues.promoCode, subTotal, {
        userId: driedValues.userId,
        guestId: driedValues.guestId,
      });
    }
    const orderDetails = this._createOrderDetails(subTotal, discountDto);

    if (
      order &&
      (order.subTotal !== subTotal || order.orderItemsMeta?.length !== itinerary.itemsOfItineraries.length)
    ) {
      await this._updateOrderWithItems(
        order.id,
        {
          ...orderDetails,
          ...(driedValues.promoCode ? { couponCode: driedValues.promoCode } : {}),
        },
        itinerary.itemsOfItineraries,
        order.orderItemsMeta,
      );
    }

    if (!order) {
      order = await this._createOrder(
        {
          ...rest,
          ...(userId ? { userId } : { guestId }),
          ...orderDetails,
          ...(driedValues.promoCode ? { couponCode: driedValues.promoCode } : {}),
          itineraryId: itinerary.id,
          status: ORDER_STATUSES.INITIATED,
        },
        itinerary.itemsOfItineraries,
      );
    }

    return order!.id;
  }

  /**
   * Book order items and update order status
   */
  public async bookOrderItemsAndUpdateOrderStatus(dto: BookOrderItemsUpdateOrderPayload): Promise<number> {
    const driedValues = this.dryPayload<BookOrderItemsUpdateOrderPayload>(
      dto,
      this.updateOrderPayloadSchema(),
    );

    SalesFlatOrderValidator.updateOrderValidator(driedValues);

    const order = await this.ordersRepository.getOrder({
      where: { id: driedValues.orderId },
      include: ['orderItemsMeta'],
    });

    if (!order || !order.orderItemsMeta?.length) {
      throw new ApplicationError({
        statusCode: 404,
        errorCode: ERROR_CODES.not_found,
        errorMessage: SFO_ERROR_MESSAGES.NOT_FOUND('Order'),
        errors: [],
      });
    }

    const t = await this.connector.getConnection()?.transaction();
    if (!t) {
      this.throwTransactionError();
    }
    try {
      if (driedValues.orderItems && driedValues?.orderItems.length) {
        const promiseArray = driedValues.orderItems.map(async (item) =>
          this._bookOrderItems(item.orderItemId, item.bookingId, t),
        );
        await Promise.all(promiseArray);
      }
      await this.ordersRepository.updateOrder(
        {
          ...(driedValues.orderUuid ? { orderUuid: driedValues.orderUuid } : {}),
          status: driedValues.orderStatus,
        },
        {
          where: { id: driedValues.orderId },
          transaction: t,
        },
      );
      if (dto.promoCode && dto.customerIds) {
        await this._promoCodeService.usePromoCode(dto.promoCode, dto.customerIds);
      }
      await t?.commit();
    } catch (error) {
      await t?.rollback();
      this.throwTransactionError();
    }

    return order.id;
  }

  /**
   * Get list of ordered tickets by order id
   */
  public async getTickets(orderId: number): Promise<TicketsDTO> {
    const rawTickets = await this.ordersRepository.getTickets(orderId);
    if (!rawTickets.items || !rawTickets.items.length) {
      rawTickets.items = [];
    }
    const tickets = rawTickets.items.map<Tickets>((ticket) => {
      let ticketsCount = 0;
      return {
        name: ticket.name,
        date: ticket.date.split(' ')[0],
        time: ticket.time,
        productOptions: (JSON.parse(ticket.productOptions) || []).map((option: AgeGroupOptions) => {
          ticketsCount++;
          return option;
        }),
        ticketsCount,
      };
    });
    return {
      ...rawTickets,
      items: tickets,
    };
  }

  /**
   * @private
   * Create order
   */
  private async _createOrder(
    dto: CreateOrderDTO,
    itineraryItems: Array<ItineraryItemModel>,
  ): Promise<SalesFlatOrderModel> {
    const t = await this.connector.getConnection()?.transaction();
    if (!t) {
      this.throwTransactionError();
    }
    let order: SalesFlatOrderModel;
    try {
      order = await this.ordersRepository.createOrder(dto, { transaction: t });
      if (itineraryItems?.length) {
        await this._createOrderItemsBulk(order.id, itineraryItems, t);
      }
      await t?.commit();
    } catch (error) {
      await t?.rollback();
      this.throwTransactionError();
    }
    return order!;
  }

  /**
   * @private
   * Create order items (Bulk)
   */
  private async _createOrderItemsBulk(
    orderId: number,
    itineraryItems: Array<ItineraryItemModel>,
    t?: Transaction,
  ) {
    const orderItems = await this._mapItineraryItemsToOrderItems(itineraryItems, orderId);
    await this.orderItemsMetaRepository.createOrderItemBulk(orderItems, {
      transaction: t,
    });
  }

  /**
   * Update order with items
   * @private
   */
  private async _updateOrderWithItems(
    orderId: number,
    dto: UpdateOrderDTO,
    itineraryItems: Array<ItineraryItemModel>,
    orderItems?: Array<SalesFlatOrderItemsMetaModel>,
  ): Promise<void> {
    const t = await this.connector.getConnection()?.transaction();
    if (!t) {
      this.throwTransactionError();
    }
    try {
      await this.ordersRepository.updateOrder(dto, { where: { id: orderId } });
      if (orderItems?.length) {
        const ids = orderItems.map((item) => item.id);
        await this.orderItemsMetaRepository.deleteOrderItem({
          where: {
            id: { [Op.in]: ids },
          },
        });
        await this._createOrderItemsBulk(orderId, itineraryItems, t);
      }
      await t?.commit();
    } catch (error) {
      await t?.rollback();
      this.throwTransactionError();
    }
  }

  /**
   * Update order item booking status and booking id
   */
  private async _bookOrderItems(orderItemId: number, bookingId: string, transaction?: Transaction) {
    return this.orderItemsMetaRepository.updateOrderItem(
      {
        isBooked: 1,
        bookingId,
      },
      {
        where: { id: orderItemId },
        ...(transaction ? { transaction } : {}),
      },
    );
  }

  /**
   * Prepare data for order items creation
   */
  private async _mapItineraryItemsToOrderItems(
    itineraryItems: Array<ItineraryItemModel>,
    orderId: number,
  ): Promise<Array<CreateOrderItemDTO>> {
    const result: Array<CreateOrderItemDTO> = [];

    for (const item of itineraryItems) {
      const variant = await this.productRepository.getVariant({
        where: { id: item.variantId },
      });
      result.push({
        orderId,
        productId: item.productId,
        headoutProductId: item.headoutProductId,
        productName: item.productName,
        headoutVariantId: item.headoutVariantId,
        variantName: item.variantName,
        headoutVariantItemId: item.headoutVariantItemId,
        productOptions: JSON.stringify(item.productOptions),
        isBooked: 0,
        bookingId: null,
        inputFieldsId: variant!.inputFieldsId,
        inputFieldsLevel: variant!.inputFieldsLevel,
        date: item.itineraryDate,
        time: item.dateTime,
      });
    }

    return result;
  }

  /**
   * Create sub total for order details
   */
  private _createSubTotal(itineraryItems: Array<ItineraryItemModel>): number {
    return itineraryItems.reduce((acc, item) => (acc += item.totalPrice), 0);
  }

  /**
   * Create order details
   */
  private _createOrderDetails(subTotal: number, discountDto: DiscountDTO | null = null): OrderDetailsDTO {
    // referral program will be added in future..maybe..
    let discountAmount, taxAmount, referralDiscount, gatewayCharges, commissionCharges;
    // eslint-disable-next-line
    taxAmount = discountAmount = referralDiscount = gatewayCharges = commissionCharges = 0.0;
    if (discountDto?.discountAmount && discountDto.discountType) {
      discountAmount =
        discountDto.discountType === PromoCodeTypes.FixedPercentage
          ? Math.ceil(subTotal * (discountDto.discountAmount / 100) * 100) / 100
          : discountDto.discountAmount;
    }
    const netTotal: number = subTotal - (discountAmount + referralDiscount);
    gatewayCharges = Math.ceil(((netTotal * 2.9) / 100 + 0.2) * 100) / 100;
    const grandTotal = netTotal + gatewayCharges;
    return {
      subTotal,
      netTotal,
      grandTotal,
      discountAmount,
      referralDiscount,
      taxAmount,
      gatewayCharges,
      commissionCharges,
    };
  }

  /**
   * Data transformation schema for create order payload
   */
  private createOrderPayloadSchema(): Record<string, (arg: any) => any> {
    return {
      userId: (value: string) => value,
      guestId: (value: string) => value,
      userName: (value: boolean) => value,
      userEmail: (value: boolean) => value,
      userPhone: (value: boolean) => value,
      promoCode: (value: string) => value,
    };
  }

  /**
   * Data transformation schema for update order payload
   */
  private updateOrderPayloadSchema(): Record<string, (arg: any) => any> {
    return {
      orderId: (value: number) => value,
      orderUuid: (value: string) => value,
      orderItems: (value: Array<ExtendedBookingMeta>) => value,
      orderStatus: (value: string) => value,
      promoCode: (value: string) => value,
      customerIds: (value: CustomersIds) => value,
    };
  }
}
