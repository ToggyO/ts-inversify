/**
 * Description: Category module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';

import { ICategoryHandler } from './interfaces';

/**
 * Router: Category
 */
@injectable()
export class CategoryRouter extends BaseRouter {
  public readonly routePrefix = '/categories';

  constructor(@inject(TYPES.ICategoryHandler) private readonly categoryController: ICategoryHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get list of e-categories
     */
    router.get('/e-categories', this.asyncWrapper(this.categoryController.getECategories));

    /**
     * Get e-category by id
     */
    router.get('/e-categories/:id', this.asyncWrapper(this.categoryController.getECategoryById));

    return router;
  }
}
