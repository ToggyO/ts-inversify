/**
 * Description: Category module controller for handling category routing
 */

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { GetEntityResponse, GetListResponse, RequestQueries } from 'modules/interfaces';
import { getSuccessRes } from 'utils/response';
import { getProp, autobind } from 'utils/helpers';

import { ECategoryModel } from './e-category.model';
import { ICategoryEntityService, ICategoryHandler } from './interfaces';

@injectable()
export class CategoryController extends BaseController implements ICategoryHandler {
  constructor(
    @inject(TYPES.ICategoryEntityService)
    protected readonly categoryService: ICategoryEntityService,
  ) {
    super();
    autobind(this);
  }

  /**
   * Get list of e-categories
   */
  public async getECategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = getProp<RequestQueries>(req, 'query', {});

      const resultData = await this.categoryService.getECategories(query);

      res.status(200).send(
        getSuccessRes<GetListResponse<ECategoryModel>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get e-category by id
   */
  public async getECategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.orderId', {});
      const query = getProp<RequestQueries>(req, 'query', {});

      const resultData = await this.categoryService.getECategoryById(id, query);

      res.status(200).send(
        getSuccessRes<GetEntityResponse<ECategoryModel>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
