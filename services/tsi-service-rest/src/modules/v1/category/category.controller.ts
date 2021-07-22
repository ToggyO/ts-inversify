/**
 * Description: Category module controller for handling category routing
 */

import { NextFunction, Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { injectable } from 'inversify';

import { BaseController } from 'modules/common';
import { getSuccessRes, Success } from 'utils/response';
import { autobind, getProp } from 'utils/helpers';
import { GetListResponse, RequestQueries } from 'modules/interfaces';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';

import { ICategoryHandler } from './interfaces';
import { ECategory } from './types';

const { CATEGORIES, getDataServiceUrl } = SERVICE_ENDPOINTS;

@injectable()
export class CategoryController extends BaseController implements ICategoryHandler {
  constructor() {
    super();
    autobind(this);
  }

  /**
   * Get list of e-categories
   */
  public async getECategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = getProp<RequestQueries>(req, 'query', {});
      const stringedQuery = stringify(query, { addQueryPrefix: true });

      const response: AxiosResponse<Success<GetListResponse<ECategory>>> = await this.axios.get(
        getDataServiceUrl(CATEGORIES.GET_E_CATEGORIES_REQUEST(stringedQuery)),
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<GetListResponse<ECategory>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
