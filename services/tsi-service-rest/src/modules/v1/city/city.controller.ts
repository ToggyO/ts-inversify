/**
 * Description: City module controller for handling cities routing
 */

import { Request, Response, NextFunction } from 'express';
import { AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { injectable } from 'inversify';

import { BaseController } from 'modules/common';
import { getSuccessRes, Success } from 'utils/response';
import { autobind, getProp } from 'utils/helpers';
import { GetListResponse, RequestQueries } from 'modules/interfaces';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';

import { City, ICityHandler, UpdateCityTopRequest } from './types';

const { CITIES, getDataServiceUrl } = SERVICE_ENDPOINTS;

@injectable()
export class CityController extends BaseController implements ICityHandler {
  constructor() {
    super();
    autobind(this);
  }

  /**
   * Get list of cities
   */
  public async getCities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = getProp<RequestQueries>(req, 'query', {});
      const stringedQuery = stringify(query, { addQueryPrefix: true });

      const response: AxiosResponse<Success<GetListResponse<City>>> = await this.axios.get(
        getDataServiceUrl(CITIES.GET_CITIES(stringedQuery)),
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<GetListResponse<City>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get city by id
   */
  public async getCity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);
      const query = getProp<RequestQueries>(req, 'query', {});
      const stringedQuery = stringify(query, { addQueryPrefix: true });

      const response: AxiosResponse<Success<City>> = await this.axios.get(
        getDataServiceUrl(CITIES.GET_CITY_BY_ID(id, stringedQuery)),
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<City>({ resultData }),
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
      const body = getProp<UpdateCityTopRequest>(req, 'body', {});

      const response: AxiosResponse<Success<City>> = await this.axios.patch(
        getDataServiceUrl(CITIES.UPDATE_TOP(id)),
        body,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<City>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
