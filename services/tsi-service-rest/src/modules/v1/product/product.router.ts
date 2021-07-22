/**
 * Description: Product module router
 */

import express from 'express';
import { inject, injectable } from 'inversify';

import { BaseRouter } from 'modules/common';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { UserStatus } from 'constants/user-statuses';
import { TYPES } from 'DIContainer/types';

import { IProductHandler } from './types';

const { PRODUCTS } = SERVICE_ENDPOINTS;

@injectable()
export class ProductRouter extends BaseRouter {
  public readonly routePrefix = PRODUCTS.ROOT;

  constructor(@inject(TYPES.IProductHandler) protected readonly productController: IProductHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get products
     * @swagger
     * path:
     *  /api-rest/products:
     *      get:
     *        tags:
     *          - Products
     *        description: Get list of products
     *        summary: Get list of products
     *        produces:
     *          - application/json
     *        parameters:
     *          - $ref: '#/components/schemas/paginationPage'
     *          - $ref: '#/components/schemas/paginationSize'
     *          - $ref: '#/components/schemas/sort'
     *          - $ref: '#/components/schemas/include'
     *          - in: query
     *            name: search
     *            description: Search for products by `name` field
     *            schema:
     *              type: string
     *          - in: query
     *            name: cityId
     *            description: Filter products by id of the city
     *            schema:
     *              type: number
     *          - in: query
     *            name: categoryId
     *            description: Filter products by id of the category
     *            schema:
     *              type: number
     *          - in: query
     *            name: date
     *            description: Filter products by date. Expected format is `YYYY-MM-DD`.
     *            schema:
     *              type: string
     *          - in: query
     *            name: time
     *            description: Filter products by part of the day.
     *            schema:
     *              type: string
     *              enum: [morning, afternoon, evening, night]
     *          - in: query
     *            name: withTopActivities
     *            description: Get products where `topActivities` field equals `true`
     *            schema:
     *              type: boolean
     *          - in: query
     *            name: withMostPopular
     *            description: Get products where `mostPopular` field equals `true`
     *            schema:
     *              type: boolean
     *          - in: query
     *            name: isActive
     *            description: Get products by `status` field
     *            schema:
     *              type: boolean
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
     *                            $ref: '#/components/schemas/Product'
     *                        pagination:
     *                          type: object
     *                          $ref: '#/components/schemas/paginationResponse'
     */
    router.get('/', this.asyncWrapper(this.productController.getProducts));

    /**
     * Get products
     * @swagger
     * path:
     *  /api-rest/products/live-search:
     *      get:
     *        tags:
     *          - Products
     *        description: Get list of products
     *        summary: Get list of products
     *        produces:
     *          - application/json
     *        parameters:
     *          - $ref: '#/components/schemas/paginationPage'
     *          - $ref: '#/components/schemas/paginationSize'
     *          - $ref: '#/components/schemas/sort'
     *          - in: query
     *            name: search
     *            description: Search for products by `name` field. Minimum string length - 4 symbols.
     *            schema:
     *              type: string
     *          - in: query
     *            name: cityId
     *            description: Filter products by id of the city
     *            schema:
     *              type: number
     *          - in: query
     *            name: isActive
     *            description: Get products by `status` field
     *            schema:
     *              type: boolean
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
     *                            $ref: '#/components/schemas/Product'
     *                        pagination:
     *                          type: object
     *                          $ref: '#/components/schemas/paginationResponse'
     */
    router.get(PRODUCTS.LIVE_SEARCH, this.asyncWrapper(this.productController.getProductsBySearchString));

    /**
     * Get product details by `slug` field
     * @swagger
     * path:
     *  /api-rest/products/slug/{slug}:
     *      get:
     *        tags:
     *          - Products
     *        description: Get product details by `slug` field
     *        summary: Get product details by `slug` field
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: slug
     *            schema:
     *              type: string
     *            required: true
     *          - $ref: '#/components/schemas/include'
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
     *                      $ref: '#/components/schemas/Product'
     *          401:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/unauthorizedResponse'
     *          404:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/notFoundResponse'
     */
    router.get(PRODUCTS.GET_BY_NAME, this.asyncWrapper(this.productController.getProductDetailsBySlug));

    /**
     * Update the `topActivities` and `mostPopular` fields of the product
     * @swagger
     * path:
     *  /api-rest/products/top/{id}:
     *      patch:
     *        tags:
     *          - Products
     *        description: Update the `topActivities` and `mostPopular` fields of the product
     *        summary: Update the `topActivities` and `mostPopular` fields of the product
     *        security:
     *          - ApiKeyAuth: []
     *        parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            required: true
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/UpdateProductTop'
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
     *                      $ref: '#/components/schemas/Product'
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
     *          404:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/notFoundResponse'
     */
    router.patch(
      `${PRODUCTS.TOP}/:id`,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.productController.updateTop),
    );

    /**
     * Checking availability of the product from Headout api
     * @swagger
     * path:
     *  /api-rest/products/check-availability/{variantId}/{variantItemId}:
     *      get:
     *        tags:
     *          - Products
     *        description: Checking availability of the product from Headout api
     *        summary: Checking availability of the product from Headout api
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: variantId
     *            schema:
     *              type: integer
     *            required: true
     *          - in: path
     *            name: variantItemId
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
     *                      $ref: '#/components/schemas/VariantAvailabilityDTO'
     */
    router.get(
      `${PRODUCTS.CHECK_AVAILABILITY}/:variantId/:variantItemId`,
      this.asyncWrapper(this.productController.checkAvailability),
    );

    /**
     * Get array of available variant dates
     * @swagger
     * path:
     *  /api-rest/products/get-variants/{variantId}/available-dates:
     *      get:
     *        tags:
     *          - Products
     *        description: Get list Get array of available variant dates
     *        summary: Get list Get array of available variant dates
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: variantId
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
     *                      properties:
     *                        items:
     *                          type: array
     *                          items:
     *                            type: string
     *          404:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/notFoundResponse'
     */
    router.get(
      PRODUCTS.GET_AVAILABLE_DATES,
      this.asyncWrapper(this.productController.getAvailableVariantDates),
    );

    /**
     * Get time options of product's variant
     * @swagger
     * path:
     *  /api-rest/products/get-variant-items:
     *      post:
     *        tags:
     *          - Products
     *        description: Get time options of product's variant
     *        summary: Get time options of product's variant
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/GetVariantItemsDTO'
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
     *                        $ref: '#/components/schemas/VariantItem'
     */
    router.post(`${PRODUCTS.GET_VARIANT_ITEMS}`, this.asyncWrapper(this.productController.getVariantItems));

    /**
     * Get age groups of variant item
     * @swagger
     * path:
     *  /api-rest/products/get-age-groups:
     *      post:
     *        tags:
     *          - Products
     *        description: Get age groups of variant item
     *        summary: Get age groups of variant item
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/GetAgeGroupsDTO'
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
     *                        $ref: '#/components/schemas/AgeGroup'
     */
    router.post(`${PRODUCTS.GET_AGE_GROUPS}`, this.asyncWrapper(this.productController.getAgeGroups));

    /**
     * Create order
     * @swagger
     * path:
     *  /api-rest/products/create-order:
     *      post:
     *        tags:
     *          - Products
     *        description: Create order
     *        summary: Create order
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/PurchaseProductUserDTO'
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
     *                      $ref: '#/components/schemas/OrderDTO'
     */
    router.post(PRODUCTS.CREATE_ORDER, this.asyncWrapper(this.productController.getOrCreateOrder));

    /**
     * Create order and pay for product
     * @swagger
     * path:
     *  /api-rest/products/purchase-product:
     *      post:
     *        tags:
     *          - Products
     *        description: Create order and pay for product
     *        summary: Create order and pay for product
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                allOf:
     *                  - $ref: '#/components/schemas/PurchaseProductUserDTO'
     *                  - $ref: '#/components/schemas/PurchaseProduct'
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
     *          404:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/notFoundResponse'
     */
    router.post(PRODUCTS.PURCHASE_PRODUCT, this.asyncWrapper(this.productController.purchaseProductBase));

    return this.router;
  }
}
