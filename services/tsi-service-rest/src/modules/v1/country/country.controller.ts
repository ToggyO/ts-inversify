/**
 * Description: User module controller for handling countries routing
 */

import { Request, Response, NextFunction } from 'express';
import { AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { injectable } from 'inversify';

import { BaseController } from 'modules/common';
import { getSuccessRes, Success } from 'utils/response';
import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, RequestQueries } from 'modules/interfaces';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';

import { AlphaCode, Country, DialCode, ICountryHandler } from './types';

const { COUNTRY, getDataServiceUrl } = SERVICE_ENDPOINTS;

@injectable()
export class CountryController extends BaseController implements ICountryHandler {
  constructor() {
    super();
    autobind(this);
  }

  /**
   * Get list of countries
   */
  public async getCountries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = getProp<RequestQueries>(req, 'query', {});
      const stringedQuery = stringify(query, { addQueryPrefix: true });

      const response: AxiosResponse<Success<GetListResponse<Country>>> = await this.axios.get(
        getDataServiceUrl(COUNTRY.GET_COUNTRIES(stringedQuery)),
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<GetListResponse<Country>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get country by id
   */
  public async getCountry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);
      const query = getProp<RequestQueries>(req, 'query', {});
      const stringedQuery = stringify(query, { addQueryPrefix: true });

      const response: AxiosResponse<Success<Country>> = await this.axios.get(
        getDataServiceUrl(COUNTRY.GET_COUNTRY_BY_ID(id, stringedQuery)),
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<Country>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Geе a list of country alpha codes stored in the database
   */
  public async getAlphaCodes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: AxiosResponse<Success<GetListResponse<AlphaCode>>> = await this.axios.get(
        getDataServiceUrl(COUNTRY.GET_ALPHA_CODES),
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<GetListResponse<AlphaCode>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a list of country dialing codes stored in the database
   */
  public async getDialCodes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response: AxiosResponse<Success<GetListResponse<DialCode>>> = await this.axios.get(
        getDataServiceUrl(COUNTRY.GET_DIAL_CODES),
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<GetListResponse<DialCode>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
