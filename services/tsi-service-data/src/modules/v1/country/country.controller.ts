/**
 * Description: Countries module controller for handling countries routing
 */

import { Request, Response, NextFunction } from 'express';
import sequelize from 'sequelize';
import { injectable, inject } from 'inversify';

import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, RequestQueries } from 'modules/interfaces';
import { ApplicationError, getSuccessRes } from 'utils/response';
import { TYPES } from 'DIContainer/types';

import { BaseController } from 'modules/common';
import { CountryModel } from './country.model';
import { ICountryHandler, ICountryEntityService } from './types';
import { COUNTRY_ERROR_MESSAGES } from './constants';

@injectable()
export class CountryController extends BaseController implements ICountryHandler {
  constructor(@inject(TYPES.ICountryEntityService) protected readonly CountryService: ICountryEntityService) {
    super();
    autobind(this);
  }

  /**
   * Get list of countries
   */
  public async getCountries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = getProp<RequestQueries>(req, 'query', {});

      const resultData = await this.CountryService.getCountries(query);

      res.status(200).send(
        getSuccessRes<GetListResponse<CountryModel>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get country by id
   */
  public async getCountryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);

      if (!id) {
        throw new ApplicationError(this.notFoundErrorPayload(COUNTRY_ERROR_MESSAGES.NOT_FOUND));
      }

      const resultData = await this.CountryService.getCountryById(id);

      if (!resultData) {
        throw new ApplicationError(this.notFoundErrorPayload(COUNTRY_ERROR_MESSAGES.NOT_FOUND));
      }

      res.status(200).send(
        getSuccessRes<CountryModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a list of country alphanumeric codes stored in the database
   */
  public async getAlphaCodes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resultData = await this.CountryService.getAlphaCodes();

      res.status(200).send(getSuccessRes({ resultData }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Geе a list of country dialing codes stored in the database
   */
  public async getDialCodes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resultData = await this.CountryService.getDialCodes();

      res.status(200).send(getSuccessRes({ resultData }));
    } catch (error) {
      next(error);
    }
  }
}
