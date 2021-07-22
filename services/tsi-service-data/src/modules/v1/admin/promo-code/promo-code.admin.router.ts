/**
 * Description: Admin - Promo codes module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';

import { IPromoCodeHandler } from './promo-code.admin.interfaces';

@injectable()
export class PromoCodeAdminRouter extends BaseRouter {
  public readonly routePrefix = '/admin/promo-codes';

  constructor(@inject(TYPES.IPromoCodeHandler) private readonly _controller: IPromoCodeHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get list of promo codes with filters
     */
    router.get('/', this.asyncWrapper(this._controller.getPromoCodesList));

    /**
     * Create new promo code
     */
    router.post('/', this.asyncWrapper(this._controller.createPromoCode));

    /**
     * Toggle promo code activity
     */
    router.get('/:promoCodeId/toggle-activity', this.asyncWrapper(this._controller.toggleActivity));

    /**
     * Remove promo code
     */
    router.delete('/:promoCodeId', this.asyncWrapper(this._controller.removePromoCode));

    return router;
  }
}
