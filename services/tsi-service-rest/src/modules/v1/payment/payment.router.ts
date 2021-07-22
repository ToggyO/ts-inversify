/**
 * Description: Payment module router
 */

import express from 'express';
import { inject, injectable } from 'inversify';

import { BaseRouter } from 'modules/common';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { UserStatus } from 'constants/user-statuses';
import { TYPES } from 'DIContainer/types';

import { IPaymentHandler } from './interfaces';

const { PAYMENT } = SERVICE_ENDPOINTS;

@injectable()
export class PaymentRouter extends BaseRouter {
  public readonly routePrefix = PAYMENT.ROOT;

  constructor(@inject(TYPES.IPaymentHandler) protected readonly paymentController: IPaymentHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;
    //
    // /**
    //  * Create payment for unauthorized user
    //  * @swagger
    //  * path:
    //  *  /api-rest/payment/stripe/single-payment:
    //  *      post:
    //  *        deprecated: true
    //  *        tags:
    //  *          - Payment
    //  *        description: Create payment for unauthorized user
    //  *        summary: Create payment for unauthorized user
    //  *        produces:
    //  *          - application/json
    //  *        requestBody:
    //  *          content:
    //  *            application/json:
    //  *              schema:
    //  *                $ref: '#/components/schemas/StripeSinglePaymentPayload'
    //  *        responses:
    //  *          200:
    //  *            description: Successful operation
    //  *            content:
    //  *              application/json:
    //  *                schema:
    //  *                  type: object
    //  *                  properties:
    //  *                    errorCode:
    //  *                      type: number
    //  *                      example: 0
    //  *                    resultData:
    //  *                      type: object
    //  *                      $ref: '#/components/schemas/PaymentDTO'
    //  *          400:
    //  *            description: Bad parameters
    //  *            content:
    //  *              application/json:
    //  *                schema:
    //  *                  type: object
    //  *                  $ref: '#/components/schemas/incorrectParamsResponse'
    //  */
    // router.post(
    //   PAYMENT.STRIPE.SINGLE_PAYMENT,
    //   this.asyncWrapper(this.paymentController.stripeCreateSinglePayment),
    // );

    // /**
    //  * Create payment for authorized user
    //  * @swagger
    //  * path:
    //  *  /api-rest/payment/stripe/customer/payment:
    //  *      post:
    //  *        tags:
    //  *          - Payment
    //  *        description: Create payment for authorized user
    //  *        summary: Create payment for authorized user
    //  *        security:
    //  *          - ApiKeyAuth: []
    //  *        produces:
    //  *          - application/json
    //  *        requestBody:
    //  *          content:
    //  *            application/json:
    //  *              schema:
    //  *                $ref: '#/components/schemas/StripeCustomerPaymentPayload'
    //  *        responses:
    //  *          200:
    //  *            description: Successful operation
    //  *            content:
    //  *              application/json:
    //  *                schema:
    //  *                  type: object
    //  *                  properties:
    //  *                    errorCode:
    //  *                      type: number
    //  *                      example: 0
    //  *                    resultData:
    //  *                      type: object
    //  *                      $ref: '#/components/schemas/PaymentDTO'
    //  *          400:
    //  *            description: Bad parameters
    //  *            content:
    //  *              application/json:
    //  *                schema:
    //  *                  type: object
    //  *                  $ref: '#/components/schemas/incorrectParamsResponse'
    //  *          401:
    //  *            content:
    //  *              application/json:
    //  *                schema:
    //  *                  type: object
    //  *                  $ref: '#/components/schemas/unauthorizedResponse'
    //  *          403:
    //  *            content:
    //  *              application/json:
    //  *                schema:
    //  *                  type: object
    //  *                  $ref: '#/components/schemas/forbiddenResponse'
    //  */
    // router.post(
    //   PAYMENT.STRIPE.CUSTOMER_PAYMENT,
    //   this.asyncWrapper(this._identityHelpers.authenticate),
    //   this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
    //   this.asyncWrapper(this.paymentController.stripeCreateCustomerPayment),
    // );

    /**
     * Get payment cards of authorized user
     * @swagger
     * path:
     *  /api-rest/payment/stripe/customer/cards:
     *      post:
     *        tags:
     *          - Payment
     *        description: Get payment cards of authorized user
     *        summary: Get payment cards of authorized user
     *        security:
     *          - ApiKeyAuth: []
     *        produces:
     *          - application/json
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  stripeCustomerToken:
     *                    type: string
     *        responses:
     *          200:
     *            description: Successful operation
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    errorCode:
     *                      type: number
     *                      example: 0
     *                    resultData:
     *                      type: array
     *                      items:
     *                        $ref: '#/components/schemas/PaymentCardDTO'
     *          400:
     *            description: Bad parameters
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/incorrectParamsResponse'
     *          401:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/unauthorizedResponse'
     *          403:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/forbiddenResponse'
     */
    router.post(
      PAYMENT.STRIPE.CUSTOMER_GET_CARDS,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.paymentController.stripeGetCustomerCards),
    );

    /**
     * Get payment card info
     * @swagger
     * path:
     *  /api-rest/payment/stripe/customer/card-info:
     *      post:
     *        tags:
     *          - Payment
     *        description: Get payment card info
     *        summary: Get payment card info
     *        security:
     *          - ApiKeyAuth: []
     *        produces:
     *          - application/json
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  cardId:
     *                    type: string
     *        responses:
     *          200:
     *            description: Successful operation
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    errorCode:
     *                      type: number
     *                      example: 0
     *                    resultData:
     *                      type: object
     *                      $ref: '#/components/schemas/PaymentCardDTO'
     *          400:
     *            description: Bad parameters
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/incorrectParamsResponse'
     *          401:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/unauthorizedResponse'
     *          403:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/forbiddenResponse'
     */
    router.post(
      PAYMENT.STRIPE.CUSTOMER_GET_CARD_INFO,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.paymentController.stripeGetCardInfo),
    );

    /**
     * Attach payment card to authorized user
     * @swagger
     * path:
     *  /api-rest/payment/stripe/customer/add-card:
     *      post:
     *        tags:
     *          - Payment
     *        description: Attach payment card to authorized user
     *        summary: Attach payment card to authorized user
     *        security:
     *          - ApiKeyAuth: []
     *        produces:
     *          - application/json
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/AddCardToCustomerDTO'
     *        responses:
     *          200:
     *            description: Successful operation
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    errorCode:
     *                      type: number
     *                      example: 0
     *                    resultData:
     *                      type: object
     *                      $ref: '#/components/schemas/PaymentCardDTO'
     *          400:
     *            description: Bad parameters
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/incorrectParamsResponse'
     *          401:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/unauthorizedResponse'
     *          403:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/forbiddenResponse'
     */
    router.post(
      PAYMENT.STRIPE.CUSTOMER_ADD_CARD,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.paymentController.stripeAddCardToCustomer),
    );

    /**
     * Detach payment card from customer
     * @swagger
     * path:
     *  /api-rest/payment/stripe/customer/remove-card/{cardId}:
     *      delete:
     *        tags:
     *          - Payment
     *        description: Detach payment card from customer
     *        summary: Detach payment card from customer
     *        security:
     *          - ApiKeyAuth: []
     *        parameters:
     *          - in: path
     *            name: cardId
     *            schema:
     *              type: integer
     *            required: true
     *        responses:
     *          200:
     *            description: Successful operation
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    errorCode:
     *                      type: number
     *                      example: 0
     *                    resultData:
     *                      type: string
     *          401:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/unauthorizedResponse'
     *          403:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/forbiddenResponse'
     *          404:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/notFoundResponse'
     */
    router.delete(
      PAYMENT.STRIPE.CUSTOMER_REMOVE_CARD,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.paymentController.stripeRemoveCardFromCustomer),
    );

    return router;
  }
}
