/**
 * Description: Cities module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';

import { ICityHandler } from 'modules/v1/city/types';

/**
 * Router: Products
 */
@injectable()
export class CityRouter extends BaseRouter {
  public readonly routePrefix = '/cities';

  constructor(@inject(TYPES.ICityHandler) protected readonly CityController: ICityHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get list of cities
     */
    router.get('/', this.asyncWrapper(this.CityController.getCities));

    /**
     * Get city
     */
    router.get('/:id', this.asyncWrapper(this.CityController.getCityById));

    /**
     * Update the `topDestination` and `topToVisit` fields of the city
     */
    router.patch('/top/:id', this.asyncWrapper(this.CityController.updateTop));

    return this.router;
  }
}
