/**
 * Description: Stripe payment module router
 */

import express from 'express';
import { inject, injectable } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';
import { SERVICE_ROUTES } from 'constants/service-routes';

import { IStripeHandler } from './interfaces';

const { STRIPE } = SERVICE_ROUTES;

@injectable()
export class StripeRouter extends BaseRouter {
  public readonly routePrefix = STRIPE.ROOT;

  constructor(@inject(TYPES.IStripeHandler) protected readonly stripeController: IStripeHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Create payment for unauthorized user
     */
    router.post(STRIPE.SINGLE_PAYMENT, this.asyncWrapper(this.stripeController.createSinglePayment));

    /**
     * Create stripe customer
     */
    router.post(STRIPE.CUSTOMER_CREATE, this.asyncWrapper(this.stripeController.createCustomer));

    /**
     * Create payment for authorized customer
     */
    router.post(STRIPE.CUSTOMER_PAYMENT, this.asyncWrapper(this.stripeController.createCustomerPayment));

    /**
     * Get payment cards of customer
     */
    router.post(STRIPE.CUSTOMER_GET_CARDS, this.asyncWrapper(this.stripeController.getCustomerCards));

    /**
     * Get payment card info
     */
    router.post(STRIPE.CUSTOMER_GET_CARD_INFO, this.asyncWrapper(this.stripeController.getCardInfo));

    /**
     * Attach payment card to customer
     */
    router.post(STRIPE.CUSTOMER_ADD_CARD, this.asyncWrapper(this.stripeController.addCardToCustomer));

    /**
     * Detach payment card from customer
     */
    router.delete(
      STRIPE.CUSTOMER_REMOVE_CARD,
      this.asyncWrapper(this.stripeController.removeCardFromCustomer),
    );

    return router;
  }
}
