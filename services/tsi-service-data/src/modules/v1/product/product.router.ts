/**
 * Description: Products module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';

import { IProductHandler } from './interfaces';

/**
 * Router: Products
 */
@injectable()
export class ProductRouter extends BaseRouter {
  public readonly routePrefix = '/products';

  constructor(@inject(TYPES.IProductHandler) protected readonly productController: IProductHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get list of products
     */
    router.get('/', this.asyncWrapper(this.productController.getProducts));

    /**
     * Get product list by `search` string
     */
    router.get('/live-search', this.asyncWrapper(this.productController.getProductsBySearchString));

    /**
     * Get product details by name
     */
    router.get('/slug/:slug', this.asyncWrapper(this.productController.getProductDetailsBySlug));

    /**
     * Get product details by id
     */
    router.get('/:id', this.asyncWrapper(this.productController.getProductDetailsById));

    /**
     * Update the `topActivities` and `mostPopular` fields of the product
     */
    router.patch('/top/:id', this.asyncWrapper(this.productController.updateTop));

    /**
     * Get array of available variant dates
     */
    router.get(
      '/get-variants/:variantId/available-dates',
      this.asyncWrapper(this.productController.getAvailableVariantDates),
    );

    /**
     * Checking availability of the product from Headout api
     */
    router.get(
      '/get-variants/:variantId/:variantItemId',
      this.asyncWrapper(this.productController.getVariantData),
    );

    /**
     * Get variant items
     */
    router.post('/get-variant-items', this.asyncWrapper(this.productController.getVariantItems));

    /**
     * Get variant item meta info
     */
    router.post('/get-variant-item-meta', this.asyncWrapper(this.productController.getVariantItemMetaInfo));

    return this.router;
  }
}
