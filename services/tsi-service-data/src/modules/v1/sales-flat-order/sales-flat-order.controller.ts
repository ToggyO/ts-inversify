/**
 * Description: Sales flat orders module controller for handling orders routing
 */

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { GetEntityResponse, GetListResponse, RequestQueries } from 'modules/interfaces';
import { getSuccessRes } from 'utils/response';
import { getProp, autobind } from 'utils/helpers';

import { SalesFlatOrderModel } from './sales-flat-order.model';
import { ISalesFlatOrderEntityService, ISalesFlatOrderHandler } from './interfaces';
import { CreateOrderPayload, TicketsDTO, BookOrderItemsUpdateOrderPayload } from './types';

@injectable()
export class SalesFlatOrderController extends BaseController implements ISalesFlatOrderHandler {
  constructor(
    @inject(TYPES.ISalesFlatOrderEntityService)
    protected readonly ordersService: ISalesFlatOrderEntityService,
  ) {
    super();
    autobind(this);
  }

  /**
   * Get list of orders
   */
  public async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = getProp<RequestQueries>(req, 'query', {});

      const resultData = await this.ordersService.getOrders(query);

      res.status(200).send(
        getSuccessRes<GetListResponse<SalesFlatOrderModel>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order by id
   */
  public async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.orderId', {});
      const query = getProp<RequestQueries>(req, 'query', {});

      const resultData = await this.ordersService.getOrderById(id, query);

      res.status(200).send(
        getSuccessRes<GetEntityResponse<SalesFlatOrderModel>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get list of order items by by user id
   */
  public async getBookingsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getProp<number>(req, 'params.userId', null);
      const query = getProp<RequestQueries>(req, 'query', {});

      const resultData = await this.ordersService.getBookingsByUserId(userId, query);

      res.status(200).send(getSuccessRes({ resultData }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create sales order with items
   */
  public async createSalesFlatOrderWithItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<CreateOrderPayload>(req, 'body', {});

      const orderId = await this.ordersService.createSalesFlatOrderWithItems(body);

      const resultData = await this.ordersService.getEntityResponse({
        id: orderId,
        include: ['orderItemsMeta'],
      });

      res.status(201).send(
        getSuccessRes<SalesFlatOrderModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update order with items
   */
  public async bookOrderItemsAndUpdateOrderStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = getProp<BookOrderItemsUpdateOrderPayload>(req, 'body', {});

      await this.ordersService.bookOrderItemsAndUpdateOrderStatus(body);
      const resultData = await this.ordersService.getEntityResponse({
        id: body.orderId,
        include: ['orderItemsMeta'],
      });

      res.status(200).send(
        getSuccessRes<SalesFlatOrderModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get list of ordered tickets by order id
   */
  public async getTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderId = getProp<number>(req, 'params.orderId', null);

      const resultData = await this.ordersService.getTickets(orderId);

      res.status(200).send(
        getSuccessRes<TicketsDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
