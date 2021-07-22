/**
 * Description: Admin - Promo codes module router
 */

import express from 'express';
import { inject, injectable } from 'inversify';

import { BaseRouter } from 'modules/common';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { TYPES } from 'DIContainer/types';

import { IPromoCodeHandler } from './promo-code.admin.interfaces';

const { ADMIN } = SERVICE_ENDPOINTS;

@injectable()
export class PromoCodeAdminRouter extends BaseRouter {
  public readonly routePrefix = ADMIN.PROMO.ROOT;

  constructor(@inject(TYPES.IPromoCodeHandler) private readonly _controller: IPromoCodeHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get list of promo codes
     * @swagger
     * path:
     *  /api-rest/admin/promo-codes:
     *      get:
     *        tags:
     *          - Admin - Promo codes
     *        description: Get list of promo codes
     *        summary: Get list of promo codes
     *        produces:
     *          - application/json
     *        parameters:
     *          - $ref: '#/components/schemas/paginationPage'
     *          - $ref: '#/components/schemas/paginationSize'
     *          - $ref: '#/components/schemas/sort'
     *          - in: query
     *            name: startDateStartRange
     *            description: Filter by `startDate` field Condition-`startDate` must be greater or equal this parameter
     *            schema:
     *              type: string
     *          - in: query
     *            name: startDateEndRange
     *            description: Filter by `startDate` field. Condition-`startDate` must be less or equal this parameter
     *            schema:
     *              type: string
     *          - in: query
     *            name: search
     *            description: Search for products by `name` field
     *            schema:
     *              type: string
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
     *                      properties:
     *                        items:
     *                          type: array
     *                          items:
     *                            $ref: '#/components/schemas/PromoCode'
     *                        pagination:
     *                          type: object
     *                          $ref: '#/components/schemas/paginationResponse'
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
    router.get(
      '/',
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.getPromoCodesList),
    );

    /**
     * Create new promo code
     * @swagger
     * path:
     *  /api-rest/admin/promo-codes:
     *      post:
     *        tags:
     *          - Admin - Promo codes
     *        description: Create new promo code
     *        summary: Create new promo code
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/CreatePromoCodeDTO'
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
     *                      $ref: '#/components/schemas/PromoCode'
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
      '/',
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.createPromoCode),
    );

    /**
     * Toggle promo code activity
     * @swagger
     * path:
     *  /api-rest/admin/promo-codes/{id}/toggle-activity:
     *      get:
     *        tags:
     *          - Admin - Promo codes
     *        description: Toggle promo code activity
     *        summary: Toggle promo code activity
     *        security:
     *          - ApiKeyAuth: []
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: id
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
     *                      type: object
     *                      $ref: '#/components/schemas/PromoCode'
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
    router.get(
      ADMIN.PROMO.TOGGLE_ACTIVITY,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.toggleActivity),
    );

    /**
     * Delete promo code by id
     * @swagger
     * path:
     *  /api-rest/admin/promo-codes/{id}:
     *      delete:
     *        tags:
     *          - Admin - Promo codes
     *        description: Delete promo code by id
     *        summary: Delete promo code by id
     *        security:
     *          - ApiKeyAuth: []
     *        parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            required: true
     *        responses:
     *          200:
     *            description: Successful operation
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
      '/:promoCodeId',
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.removePromoCode),
    );

    return router;
  }
}
