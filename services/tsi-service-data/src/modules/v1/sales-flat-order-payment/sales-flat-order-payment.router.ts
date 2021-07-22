/**
 * Description: Sales flat order payment module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';

import { ISalesFlatOrderPaymentHandler } from './interfaces';

/**
 * Router: Sales flat order payment
 */
@injectable()
export class SalesFlatOrderPaymentRouter extends BaseRouter {
  public readonly routePrefix = '/orders/payments';

  constructor(
    @inject(TYPES.ISalesFlatOrderPaymentHandler)
    protected readonly orderPaymentsController: ISalesFlatOrderPaymentHandler,
  ) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get list of order payments
     */
    router.get('/', this.asyncWrapper(this.orderPaymentsController.getOrderPayments));

    /**
     * Get order payment by id
     */
    router.get('/:id', this.asyncWrapper(this.orderPaymentsController.getOrderPaymentById));

    /**
     * Create order payment data
     */
    router.post('/', this.asyncWrapper(this.orderPaymentsController.createOrderPayment));

    return router;
  }
}
