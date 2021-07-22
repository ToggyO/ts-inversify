/**
 * Description: Admin - Products module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';

import { IProductAdminHandler } from './product.admin.interfaces';

@injectable()
export class ProductAdminRouter extends BaseRouter {
  public readonly routePrefix = '/admin/products';

  constructor(@inject(TYPES.IProductAdminHandler) private readonly _controller: IProductAdminHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Create custom product with product details
     */
    router.post('/', this.asyncWrapper(this._controller.createProductWithDetails));

    /**
     * Update product
     */
    router.put('/:productId', this.asyncWrapper(this._controller.updateProduct));

    /**
     * Update product details
     */
    router.put('/:productId/details', this.asyncWrapper(this._controller.updateProductDetails));

    /**
     * Update product meta info
     */
    router.put('/:productId/meta-info', this.asyncWrapper(this._controller.updateProductMetaInfo));

    /**
     * Create custom product with product details
     */
    router.get('/:productId/toggle-block', this.asyncWrapper(this._controller.toggleProductBlock));

    /**
     * Attach set of image urls to product
     */
    router.post('/:productId/attach-media', this.asyncWrapper(this._controller.attachMediaUrls));

    /**
     * Set position of image in product media gallery
     */
    router.put('/:productId/gallery-position', this.asyncWrapper(this._controller.setGalleryPosition));

    /**
     * Remove an image attached to product
     */
    router.post('/:productId/remove-media', this.asyncWrapper(this._controller.removeAsset));

    return router;
  }
}
