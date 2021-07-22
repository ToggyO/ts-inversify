/**
 * Description: Category module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { TYPES } from 'DIContainer/types';

import { ICategoryHandler } from './interfaces';

const { CATEGORIES } = SERVICE_ENDPOINTS;

@injectable()
export class CategoryRouter extends BaseRouter {
  public readonly routePrefix = CATEGORIES.ROOT;

  constructor(@inject(TYPES.ICategoryHandler) protected readonly categoriesController: ICategoryHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get list of e-categories
     * @swagger
     * path:
     *  /api-rest/categories/e-categories:
     *      get:
     *        tags:
     *          - Categories
     *        description: Get list of e-categories
     *        summary: Get list of e-categories
     *        produces:
     *          - application/json
     *        parameters:
     *          - $ref: '#/components/schemas/paginationPage'
     *          - $ref: '#/components/schemas/paginationSize'
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
     *                            $ref: '#/components/schemas/ECategory'
     */
    router.get(CATEGORIES.GET_E_CATEGORIES, this.asyncWrapper(this.categoriesController.getECategories));

    return router;
  }
}
