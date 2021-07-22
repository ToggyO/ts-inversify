/**
 * Description: Shopping cart module router
 */

import express from 'express';
import { inject, injectable } from 'inversify';

import { BaseRouter } from 'modules/common';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { TYPES } from 'DIContainer/types';

import { ICartHandler } from './interfaces';

const { SHOPPING_CART } = SERVICE_ENDPOINTS;

@injectable()
export class CartRouter extends BaseRouter {
  public readonly routePrefix = SHOPPING_CART.ROOT;

  constructor(@inject(TYPES.ICartHandler) protected readonly CartController: ICartHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get shopping cart if exists
     * @swagger
     * path:
     *  /api-rest/cart:
     *      get:
     *        tags:
     *          - Cart
     *        description: Get shopping cart if exists
     *        summary: Get shopping cart if exists
     *        produces:
     *          - application/json
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
     *                      $ref: '#/components/schemas/Cart'
     */
    router.get('/', this.asyncWrapper(this.CartController.getCart));

    /**
     * Create shopping cart or update existed cart by adding new item
     * @swagger
     * path:
     *  /api-rest/cart:
     *      post:
     *        tags:
     *          - Cart
     *        description: Create shopping cart or update existed cart by adding new item
     *        summary: Create shopping cart or update existed cart by adding new item
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/AddToCartDTO'
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
     *                      $ref: '#/components/schemas/CartItemDTO'
     *          409:
     *            description: Bad parameters
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/unprocessableEntityResponse'
     */
    router.post('/', this.asyncWrapper(this.CartController.addToCart));

    /**
     * Update cart item associated with cart by id
     * @swagger
     * path:
     *  /api-rest/cart:
     *      patch:
     *        tags:
     *          - Cart
     *        description: Update cart item associated with cart by id
     *        summary: Update cart item associated with cart by id
     *        produces:
     *          - application/json
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/UpdateCartItemDTO'
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
     *                      $ref: '#/components/schemas/Cart'
     *          404:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/notFoundResponse'
     */
    router.patch('/', this.asyncWrapper(this.CartController.updateCart));

    /**
     * Remove item from shopping cart
     * @swagger
     * path:
     *  /api-rest/cart/remove/{itineraryItemId}:
     *      delete:
     *        tags:
     *          - Cart
     *        description: Remove item from shopping cart
     *        summary: Remove item from shopping cart
     *        parameters:
     *          - in: path
     *            name: itineraryItemId
     *            schema:
     *              type: integer
     *            required: true
     *        responses:
     *          200:
     *            description: Successful operation
     *          404:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/notFoundResponse'
     */
    router.delete('/remove/:itineraryItemId', this.asyncWrapper(this.CartController.removeItemFromCart));

    return router;
  }
}
