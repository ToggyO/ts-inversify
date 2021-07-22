/**
 * Description: Product module controller for handling products routing
 */

import { NextFunction, Request, Response } from 'express';
import { Queue } from 'bull';
import { AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { inject, injectable } from 'inversify';

import { ExtendedSession } from 'declaration';
import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { getSuccessRes, Success } from 'utils/response';
import { autobind, getProp, Mails } from 'utils/helpers';
import { CustomersIds, IIdentityHelpers, JWTTokenPayload } from 'utils/authentication';
import { GetListResponse, RequestQueries } from 'modules/interfaces';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { MICROSERVICES_AUTH_HEADER } from 'constants/common';
import { PaymentDTO, PaymentStatuses } from 'modules/v1/payment';
import { ExtendedBookingMeta, ExtendedBookingMetaDTO } from 'utils/headout';
import { IQueueRegistry, MailQueueDTO } from 'utils/queue';

import {
  CheckAvailabilityDTO,
  CreateOrderDTO,
  GetAgeGroupsDTO,
  GetVariantItemsDTO,
  IProductHandler,
  OrderDTO,
  OrderItemDTO,
  Product,
  PurchaseProductDTO,
  PurchaseProductUserDTO,
  TicketsDTO,
  TransactionDataDTO,
  UpdateProductTopRequest,
  VariantItem,
  VariantsDTO,
} from './types';
import { OrderStatuses } from './product.enums';
import { IHeadoutService, VariantAvailabilityDTO, VariantPricing } from '../headout';
import { HeadoutMapper } from '../headout/headout.mapper';

const {
  PRODUCTS,
  ORDERS,
  PAYMENT,
  SHOPPING_CART,
  getDataServiceUrl,
  getPaymentServiceUrl,
} = SERVICE_ENDPOINTS;

@injectable()
export class ProductController extends BaseController implements IProductHandler {
  protected readonly _mailQueue: Queue;

  constructor(
    @inject(TYPES.IConfiguration) protected readonly configService: IConfiguration,
    @inject(TYPES.IHeadoutService) protected readonly headoutService: IHeadoutService,
    @inject(TYPES.IIdentityHelpers) protected readonly _identityHelpers: IIdentityHelpers,
    @inject(TYPES.IQueueRegistry) queueRegistry: IQueueRegistry,
  ) {
    super();
    autobind(this);
    const maiQueueName = this.configService.get<string>('QUEUE_NAME_MAIL', '');
    this._mailQueue = queueRegistry.getQueue<MailQueueDTO>(maiQueueName);
    // FIXME: delete
    // this.testMail();
    // setTimeout(
    //   () =>
    //     this._sendMailWithTickets(1783, {
    //       userName: 'Slava',
    //       userEmail: 'blinsmaslom@mail.ru',
    //       userPhone: '405934788',
    //     } as PurchaseProductUserDTO),
    //   2000,
    // );
  }

  /**
   * Get list of products
   */
  public async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = getProp<RequestQueries>(req, 'query', {});
      const stringedQuery = stringify(query, { addQueryPrefix: true });
      const token = getProp<string>(req, 'session.token', undefined);

      const user = this._identityHelpers.checkToken<JWTTokenPayload>(token);

      const response: AxiosResponse<Success<GetListResponse<Product>>> = await this.axios.get(
        getDataServiceUrl(PRODUCTS.GET_PRODUCTS(stringedQuery)),
        {
          ...(user?.id ? { headers: { [MICROSERVICES_AUTH_HEADER]: user.id } } : {}),
        },
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<GetListResponse<Product>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product list by `search` string
   */
  public async getProductsBySearchString(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = getProp<RequestQueries>(req, 'query', {});
      const stringedQuery = stringify(query, { addQueryPrefix: true });
      const response: AxiosResponse<Success<GetListResponse<Product>>> = await this.axios.get(
        getDataServiceUrl(PRODUCTS.LIVE_SEARCH_REQUEST(stringedQuery)),
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<GetListResponse<Product>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product details by name
   */
  public async getProductDetailsBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = getProp<string>(req, 'params.slug', undefined);
      const query = getProp<RequestQueries>(req, 'query', {});
      const stringedQuery = stringify(query, { addQueryPrefix: true });
      const token = getProp<string>(req, 'session.token', undefined);

      const user = this._identityHelpers.checkToken<JWTTokenPayload>(token);

      const response: AxiosResponse<Success<Product>> = await this.axios.get(
        getDataServiceUrl(PRODUCTS.GET_PRODUCT_DETAILS_BY_SLUG(slug, stringedQuery)),
        {
          ...(user?.id ? { headers: { [MICROSERVICES_AUTH_HEADER]: user.id } } : {}),
        },
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<Product>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update the `top` field of the city
   */
  public async updateTop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);
      const body = getProp<UpdateProductTopRequest>(req, 'body', {});

      const response: AxiosResponse<Success<Product>> = await this.axios.patch(
        getDataServiceUrl(PRODUCTS.UPDATE_TOP(id)),
        body,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<Product>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Checking availability of the product from Headout api
   */
  public async checkAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = getProp<CheckAvailabilityDTO>(req, 'params', {});

      const getVariantsResponse: AxiosResponse<Success<VariantsDTO>> = await this.axios.get(
        getDataServiceUrl(PRODUCTS.CHECK_AVAILABILITY_REQUEST(params.variantId, params.variantItemId)),
      );

      if (getVariantsResponse.status !== 200) {
        this.throwNonSuccessResponseError(getVariantsResponse);
      }

      const { resultData } = getVariantsResponse.data;
      const { headoutVariantId, variantName, startDateTime, endDateTime } = resultData;

      const variantData = await this.headoutService.getVariants(headoutVariantId, startDateTime, endDateTime);
      const result = {
        ...variantData,
        headoutVariantId,
        variantName,
      };

      res.status(200).send(
        getSuccessRes<VariantAvailabilityDTO>({ resultData: result }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get array of available variant dates
   */
  public async getAvailableVariantDates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const variantId = getProp<number>(req, 'params.variantId', null);
      const response: AxiosResponse<Success<Array<string>>> = await this.axios.get(
        getDataServiceUrl(PRODUCTS.GET_AVAILABLE_DATES_REQUEST(variantId)),
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<Array<string>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get time options of product's variant
   */
  public async getVariantItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = getProp<GetVariantItemsDTO>(req, 'body', {});

      const response: AxiosResponse<Success<VariantItem>> = await this.axios.post(
        getDataServiceUrl(PRODUCTS.GET_VARIANT_ITEMS_REQUEST),
        dto,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { resultData } = response.data;

      res.status(200).send(
        getSuccessRes<VariantItem>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get age groups of variant item
   */
  public async getAgeGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<GetAgeGroupsDTO>(req, 'body', null);

      const response: AxiosResponse<Success<Array<VariantPricing>>> = await this.axios.post(
        getDataServiceUrl(PRODUCTS.GET_VARIANT_ITEM_META_INFO),
        body,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { resultData } = response.data;

      res.status(200).send(
        getSuccessRes<Array<VariantPricing>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create order API request
   */
  public async getOrCreateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { order } = await this._createOrder<PurchaseProductUserDTO>(req);
      res.status(200).send(
        getSuccessRes<OrderDTO>({ resultData: order }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Product purchase flow: base
   * Checks for order availability
   * If the order exists, the status of the order is checked and the appropriate step of the payment is selected
   */
  public async purchaseProductBase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customerIds, body, order, orderItemsMeta } = await this._createOrder<PurchaseProductDTO>(req);
      const requestPayload = { ...body, ...customerIds };

      switch (order.status) {
        case OrderStatuses.INITIATED:
        case OrderStatuses.FAILED:
          await this.purchaseProductStepOne(
            order,
            orderItemsMeta,
            {
              userEmail: body.userEmail,
              userName: body.userName,
              userPhone: body.userPhone,
              promoCode: order.couponCode,
            },
            requestPayload,
          );
          break;
        case OrderStatuses.PROCESSING:
          await this.purchaseProductStepTwo(
            order,
            orderItemsMeta,
            requestPayload,
            undefined,
            order.couponCode,
          );
          break;
        case OrderStatuses.PENDING:
          await this.purchaseProductStepThree(
            order,
            orderItemsMeta,
            customerIds,
            undefined,
            undefined,
            order.couponCode,
          );
          break;
        default:
          break;
      }

      /**
       * Non-blocking request
       */
      this._sendMailWithTickets(order.id, body);

      res.status(200).send(getSuccessRes({ resultData: null }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Product purchase flow: step one
   * Creates bookings or receives existed  from Headout
   * Makes order update
   * Calls the second step
   */
  private async purchaseProductStepOne(
    order: OrderDTO,
    orderItems: Array<OrderItemDTO>,
    user: PurchaseProductUserDTO,
    requestPayload: PurchaseProductDTO & CustomersIds,
  ): Promise<void> {
    let bookingsDto = await this.getBookingsMeta(orderItems);
    if (!bookingsDto.bookingMeta.length) {
      bookingsDto = await this.headoutService.createBooking(orderItems, {
        userEmail: user.userEmail,
        userName: user.userName,
        userPhone: user.userPhone,
        promoCode: user.promoCode,
      });
    }
    await this.updateOrder({
      order,
      orderStatus: OrderStatuses.PROCESSING,
      orderItems: bookingsDto.bookingMeta,
    });
    await this.purchaseProductStepTwo(order, orderItems, requestPayload, bookingsDto, user.promoCode);
  }

  /**
   * Product purchase flow: step two
   * Receives existed bookings
   * Creates charge or customer payment
   * Creates a record about payment in database
   * Makes order update
   */
  private async purchaseProductStepTwo(
    order: OrderDTO,
    orderItems: Array<OrderItemDTO>,
    requestPayload: PurchaseProductDTO & CustomersIds,
    bookingsDto?: ExtendedBookingMetaDTO,
    promoCode?: string,
  ): Promise<void> {
    if (!bookingsDto || !bookingsDto.bookingMeta.length) {
      bookingsDto = await this.getBookingsMeta(orderItems);
    }
    requestPayload.paymentInfo.amount = order.grandTotal;
    // Сrutch
    requestPayload.paymentInfo.description = `TSI-TKT-${order.id}`;
    const paymentData = await this.createPayment(requestPayload);
    const transactionDataResponse: AxiosResponse<Success<TransactionDataDTO>> = await this.axios.post(
      getDataServiceUrl(ORDERS.CREATE_ORDER_PAYMENT),
      {
        orderId: order.id,
        referenceId: paymentData.referenceId,
        reason: paymentData.reason,
        totalPaid: order.grandTotal,
        paymentStatus: paymentData.status,
      },
    );

    let orderUuid: string | undefined = undefined;
    if (transactionDataResponse.status === 201) {
      orderUuid = transactionDataResponse.data.resultData.transactionId;
    }
    await this.updateOrder({
      order,
      orderStatus: OrderStatuses.PENDING,
      orderItems: bookingsDto.bookingMeta,
      orderUuid,
    });
    await this.purchaseProductStepThree(
      order,
      orderItems,
      { userId: requestPayload.userId, guestId: requestPayload.guestId },
      paymentData,
      bookingsDto,
      promoCode,
    );
  }

  /**
   * Product purchase flow: step three
   * Receives existed bookings
   * Receives order, updated by previous step
   * Accepts booking on Headout
   * Makes non-blocking update of the order
   */
  private async purchaseProductStepThree(
    order: OrderDTO,
    orderItems: Array<OrderItemDTO>,
    customerIds: CustomersIds,
    paymentData?: PaymentDTO,
    bookingsDto?: ExtendedBookingMetaDTO,
    promoCode?: string,
  ) {
    if (!bookingsDto) {
      bookingsDto = await this.getBookingsMeta(orderItems);
    }

    if (!order.orderUuid && !order.orderPayment) {
      const dataServiceResponse: AxiosResponse<Success<OrderDTO>> = await this.axios.get(
        getDataServiceUrl(ORDERS.GET_ORDER_BY_ID_REQUEST(order.id)),
      );

      if (dataServiceResponse.status !== 200) {
        this.throwNonSuccessResponseError(dataServiceResponse);
      }
      const { resultData } = dataServiceResponse.data;
      // FIXME: delete
      console.log('received order from data service ib purchaseProductStepThree', resultData);
      order = resultData;
    }

    await this.headoutService.updateBooking(bookingsDto.bookingMeta, order.orderUuid);

    if (!paymentData) {
      paymentData = HeadoutMapper.mapToPaymentDTO(order.orderPayment!);
    }

    /**
     * Non-blocking request to save the data of the completed transaction
     */
    this.completeOrderFlow(
      order,
      bookingsDto.bookingMeta,
      paymentData?.status as PaymentStatuses,
      customerIds,
      promoCode,
    );
  }

  /**
   * Create order using cart items
   */
  private async _createOrder<T extends PurchaseProductUserDTO>(req: Request): Promise<CreateOrderDTO<T>> {
    const body = getProp<T>(req, 'body', {});
    const session = getProp<ExtendedSession>(req, 'session', undefined);
    const customerIds = await this._identityHelpers.getCustomerIds(session);

    const response: AxiosResponse<Success<OrderDTO>> = await this.axios.post(
      getDataServiceUrl(ORDERS.MANAGE_ORDER_REQUEST),
      { ...body, ...customerIds },
    );
    if (response.status !== 201) {
      this.throwNonSuccessResponseError(response);
    }
    const { resultData: order } = response.data;
    const { orderItemsMeta = [] } = order;
    return { customerIds, body, order, orderItemsMeta };
  }

  /**
   * Pay for the product
   */
  private async createPayment(dto: PurchaseProductDTO & CustomersIds): Promise<PaymentDTO> {
    let url: string = PAYMENT.STRIPE.SINGLE_PAYMENT;
    if (dto.userId && !dto.paymentInfo.walletType) {
      console.log('in customer payment');
      console.log('user id: ', dto.userId);
      console.log('wallet: ', dto.paymentInfo.walletType);
      url = PAYMENT.STRIPE.CUSTOMER_PAYMENT;
    }
    const response: AxiosResponse<Success<PaymentDTO>> = await this.axios.post(getPaymentServiceUrl(url), {
      ...dto.paymentInfo,
      email: dto.userEmail,
    });

    if (response.status !== 200) {
      this.throwNonSuccessResponseError(response);
    }
    return response.data.resultData;
  }

  /**
   * Save payment data and update order
   */
  private async completeOrderFlow(
    order: OrderDTO,
    orderItems: Array<ExtendedBookingMeta>,
    paymentStatus: PaymentStatuses,
    customerIds: CustomersIds,
    promoCode?: string,
  ) {
    const orderStatus =
      paymentStatus === PaymentStatuses.Failed ? OrderStatuses.FAILED : OrderStatuses.CONFIRMED;
    await this.updateOrder({
      order,
      orderStatus,
      orderItems,
      promoCode,
      customerIds,
    });
    await this.axios.post(getDataServiceUrl(SHOPPING_CART.ITINERARY_BOOK_REQUEST), customerIds);
  }

  /**
   * Get create bookings meta info
   */
  private async getBookingsMeta(orderItems: Array<OrderItemDTO>): Promise<ExtendedBookingMetaDTO> {
    const bookingMeta = (orderItems || []).map((item) => ({
      bookingId: item.bookingId,
      orderItemId: item.id,
    }));
    return this.headoutService.getBookingsMeta(bookingMeta);
  }

  /**
   * Update order
   */
  private async updateOrder(dto: {
    order: OrderDTO;
    orderStatus: OrderStatuses;
    orderItems?: Array<ExtendedBookingMeta>;
    orderUuid?: string;
    promoCode?: string;
    customerIds?: CustomersIds;
  }) {
    const { order, orderItems, orderStatus, orderUuid, promoCode, customerIds } = dto;
    return this.axios.patch(getDataServiceUrl(ORDERS.MANAGE_ORDER_REQUEST), {
      orderId: order.id,
      orderItems,
      orderStatus,
      orderUuid,
      promoCode,
      customerIds,
    });
  }

  /**
   * get tickets and send by email
   */
  private async _sendMailWithTickets(orderId: number, user: PurchaseProductUserDTO) {
    const response: AxiosResponse<Success<TicketsDTO>> = await this.axios.get(
      getDataServiceUrl(ORDERS.GET_TICKETS_REQUEST(orderId)),
    );
    if (response.status !== 200) {
      this.throwNonSuccessResponseError(response);
    }
    const { resultData } = response.data;
    const sendMailJob = this.configService.get<string>('QUEUE_JOB_NAME_SEND_EMAIL', '');
    this._mailQueue.add(
      sendMailJob,
      Mails.sendTickets(resultData, {
        firstName: user.userName,
        email: user.userEmail,
      }),
    );
  }

  // FIXME: delete
  private testMail() {
    console.log('er');
    const ticketsDTO: TicketsDTO = {
      order: {
        orderUuid: 'TSI-TKT-1783',
        subTotal: 87.04,
        grandTotal: 88.7,
        gatewayCharges: 1.66,
      },
      items: [
        {
          name: 'Tour 1',
          date: '2020-05-21',
          time: '05:00 - 12:00',
          ticketsCount: 3,
          productOptions: [
            {
              name: 'ADULT',
              orderedQty: 2,
              totalPrice: 61.28,
              originalPrice: 30.64,
              ageFrom: 18,
              ageTo: null,
            },
            {
              name: 'CHILD',
              orderedQty: 1,
              totalPrice: 15.4,
              originalPrice: 15.4,
              ageFrom: 3,
              ageTo: 18,
            },
          ],
        },
        {
          name: 'Tour 2',
          date: '2020-11-15',
          time: '13:00 - 17:30',
          ticketsCount: 1,
          productOptions: [
            {
              name: 'CHILD',
              orderedQty: 1,
              totalPrice: 10.4,
              originalPrice: 10.4,
              ageFrom: 3,
              ageTo: 18,
            },
          ],
        },
      ],
    };
    const sendMailJob = this.configService.get<string>('QUEUE_JOB_NAME_SEND_EMAIL', '');
    this._mailQueue.add(
      sendMailJob,
      // Mails.sendOtp('690734', { email: 'blinsmaslom@mail.ru', firstName: 'Slava' }),
      Mails.sendRestorePassword(
        `https://easyguide.magora.work/reset-password?token=dfpogxkcmkl2343l4j4j3jnjnfj34njnjk`,
        { email: 'blinsmaslom@mail.ru', firstName: 'Slava' },
        // { email: 'togushakov@magora-systems.com', firstName: 'Slava' },
        // { email: 'pisap73715@wedbo.net', firstName: 'Slava' },
      ),
      // Mails.sendTickets(ticketsDTO, {
      //   firstName: 'Slava',
      //   // email: 'pisap73715@wedbo.net',
      //   email: 'blinsmaslom@mail.ru',
      //   // email: 'togushakov@magora-systems.com',
      // }),
    );
  }
}
