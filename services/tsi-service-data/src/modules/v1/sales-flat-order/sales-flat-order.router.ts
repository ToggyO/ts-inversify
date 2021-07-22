/**
 * Description: Sales flat orders module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';

import { ISalesFlatOrderHandler } from './interfaces';

/**
 * Router: Sales flat orders
 */
@injectable()
export class SalesFlatOrderRouter extends BaseRouter {
  public readonly routePrefix = '/orders';

  constructor(
    @inject(TYPES.ISalesFlatOrderHandler) protected readonly ordersController: ISalesFlatOrderHandler,
  ) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get list of orders
     */
    router.get('/', this.asyncWrapper(this.ordersController.getOrders));

    /**
     * Get list of order items by by user id
     */
    router.get('/by-user/:userId', this.asyncWrapper(this.ordersController.getBookingsByUserId));

    /**
     * Get list of ordered tickets by order id
     */
    router.get('/:orderId/tickets', this.asyncWrapper(this.ordersController.getTickets));

    /**
     * Get order by id
     */
    router.get('/:orderId', this.asyncWrapper(this.ordersController.getOrderById));

    /**
     * Create sales order with items
     */
    router.post('/', this.asyncWrapper(this.ordersController.createSalesFlatOrderWithItems));

    /**
     * Update sales order with items
     */
    router.patch('/', this.asyncWrapper(this.ordersController.bookOrderItemsAndUpdateOrderStatus));

    return router;
  }
}
