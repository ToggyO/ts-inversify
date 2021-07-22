/**
 * Description: Admin - Product module router
 */

import express from 'express';
import { Multer } from 'multer';
import { inject, injectable } from 'inversify';

import { BaseRouter } from 'modules/common';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { PRODUCT_MEDIA_FIELD_NAME } from 'constants/file-upload';
import { TYPES } from 'DIContainer/types';
import { IFileHandler } from 'utils/fileHandle';

import { IProductAdminHandler } from './product.admin.interfaces';

const { ADMIN } = SERVICE_ENDPOINTS;

@injectable()
export class ProductAdminRouter extends BaseRouter {
  public readonly routePrefix = `${ADMIN.ROOT}${ADMIN.PRODUCTS.ROOT}`;

  constructor(
    @inject(TYPES.IProductAdminHandler) private readonly _controller: IProductAdminHandler,
    @inject(TYPES.IFileHandler) protected readonly _fileHandler: IFileHandler<Multer>,
  ) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get product details by id
     * @swagger
     * path:
     *  /api-rest/admin/products/{id}:
     *      get:
     *        tags:
     *          - Admin - Products
     *        description: Get product details by id
     *        summary: Get product details by id
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
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
      '/:id',
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.getProductDetailsById),
    );

    /**
     * Create product with details
     * @swagger
     * path:
     *  /api-rest/admin/products:
     *      post:
     *        tags:
     *          - Admin - Products
     *        description: Create product with details
     *        summary: Create product with details
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                allOf:
     *                  - $ref: '#/components/schemas/CreateProductDTO'
     *                  - $ref: '#/components/schemas/CreateProductDetailsDTO'
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
     */
    router.post(
      '/',
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.createProductWithDetails),
    );

    /**
     * Update product
     * @swagger
     * path:
     *  /api-rest/admin/products/update/{id}:
     *      put:
     *        tags:
     *          - Admin - Products
     *        description: Update product
     *        summary: Update product
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            required: true
     *          - $ref: '#/components/schemas/include'
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/CreateProductDTO'
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
    router.put(
      ADMIN.PRODUCTS.UPDATE,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.updateProduct),
    );

    /**
     * Update product details
     * @swagger
     * path:
     *  /api-rest/admin/products/update/{id}/details:
     *      put:
     *        tags:
     *          - Admin - Products
     *        description: Update product details
     *        summary: Update product details
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            required: true
     *          - $ref: '#/components/schemas/include'
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/CreateProductDetailsDTO'
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
    router.put(
      ADMIN.PRODUCTS.UPDATE_DETAILS,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.updateProductDetails),
    );

    /**
     * Update product meta-info
     * @swagger
     * path:
     *  /api-rest/admin/products/update/{id}/meta-info:
     *      put:
     *        tags:
     *          - Admin - Products
     *        description: Update product meta-info
     *        summary: Update product meta-info
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            required: true
     *          - $ref: '#/components/schemas/include'
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/ProductMetaInfoDTO'
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
    router.put(
      ADMIN.PRODUCTS.UPDATE_META_INFO,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.updateProductMetaInfo),
    );

    /**
     * Toggle `status` field of the product
     * @swagger
     * path:
     *  /api-rest/admin/products/update/{id}/toggle-block:
     *      get:
     *        tags:
     *          - Admin - Products
     *        description: Toggle `status` field of the product
     *        summary: Toggle `status` field of the product
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
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
      ADMIN.PRODUCTS.TOGGLE_BLOCK,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.toggleProductBlock),
    );

    /**
     * Attach a set of images to product
     * @swagger
     * path:
     *  /api-rest/admin/products/{id}/attach-media:
     *      post:
     *        tags:
     *          - Admin - Products
     *        description: Attach a set of images to product
     *        summary: Attach a set of images to product
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            required: true
     *        requestBody:
     *          content:
     *            multipart/form-data:
     *              schema:
     *                type: object
     *                properties:
     *                  productMedia:
     *                    type: array
     *                    items:
     *                      type: string
     *                      format: binary
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
    router.post(
      ADMIN.PRODUCTS.ATTACH_MEDIA,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._fileHandler.uploadMany(PRODUCT_MEDIA_FIELD_NAME, 6)),
      this.asyncWrapper(this._controller.attachImagesToProduct),
    );

    /**
     * Set position of image in product media gallery
     * @swagger
     * path:
     *  /api-rest/admin/products/{id}/gallery-position:
     *      put:
     *        tags:
     *          - Admin - Products
     *        description: Set position of image in product media gallery
     *        summary: Set position of image in product media gallery
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            required: true
     *          - $ref: '#/components/schemas/include'
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/ChangeGalleryPositionDTO'
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
    router.put(
      ADMIN.PRODUCTS.GALLERY_POSITION,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.setGalleryPosition),
    );

    /**
     * Remove an image attached to product
     * @swagger
     * path:
     *  /api-rest/admin/products/{id}/remove-media:
     *      post:
     *        tags:
     *          - Admin - Products
     *        description: Remove an image attached to product
     *        summary: Remove an image attached to product
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            required: true
     *          - $ref: '#/components/schemas/include'
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  assetId:
     *                    type: integer
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
    router.post(
      ADMIN.PRODUCTS.REMOVE_ASSET,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.removeAsset),
    );

    return router;
  }
}
