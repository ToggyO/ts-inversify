/**
 * Description: Cities module controller for handling cities routing
 */

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { BaseController } from 'modules/common';
import { GetListResponse, RequestQueries } from 'modules/interfaces';
import { ApplicationError, getSuccessRes } from 'utils/response';
import { getProp, autobind } from 'utils/helpers';
import { TYPES } from 'DIContainer/types';

import { CityModel } from './city.model';
import { ICityHandler, ICityEntityService, UpdateCityTopRequest } from './types';
import { CITY_ERROR_MESSAGES } from './constants';

@injectable()
export class CityController extends BaseController implements ICityHandler {
  constructor(@inject(TYPES.ICityEntityService) protected readonly CityService: ICityEntityService) {
    super();
    autobind(this);
  }

  /**
   * Get list of cities
   */
  public async getCities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = getProp<RequestQueries>(req, 'query', {});

      const resultData = await this.CityService.getCities(query);

      res.status(200).send(
        getSuccessRes<GetListResponse<CityModel>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get city by id
   */
  public async getCityById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);

      if (!id) {
        throw new ApplicationError(this.notFoundErrorPayload(CITY_ERROR_MESSAGES.NOT_FOUND));
      }

      const query = getProp<RequestQueries>(req, 'query', {});

      const resultData = await this.CityService.getCityById(id, query);

      if (!resultData) {
        throw new ApplicationError(this.notFoundErrorPayload(CITY_ERROR_MESSAGES.NOT_FOUND));
      }

      res.status(200).send(
        getSuccessRes<CityModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update the `top` field of the city
   */
  public async updateTop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);

      if (!id) {
        throw new ApplicationError(this.notFoundErrorPayload(CITY_ERROR_MESSAGES.NOT_FOUND));
      }

      const body = getProp<UpdateCityTopRequest>(req, 'body', {});

      const resultData = await this.CityService.updateCityTopById(id, body);

      if (!resultData) {
        throw new ApplicationError(this.notFoundErrorPayload(CITY_ERROR_MESSAGES.NOT_FOUND));
      }

      res.status(200).send(
        getSuccessRes<CityModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
