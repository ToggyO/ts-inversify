/**
 * Description: Admin - Promo codes module controller
 */

import { NextFunction, Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { injectable } from 'inversify';

import { BaseController } from 'modules/common';
import { GetListResponse, RequestQueries } from 'modules/interfaces';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { autobind, getProp } from 'utils/helpers';
import { getSuccessRes, Success } from 'utils/response';

import { IPromoCodeHandler } from './promo-code.admin.interfaces';
import { CreatePromoCodeDTO, PromoCode } from './promo-codes.admin.types';

const { ADMIN, getDataServiceUrl } = SERVICE_ENDPOINTS;

@injectable()
export class PromoCodeAdminController extends BaseController implements IPromoCodeHandler {
  constructor() {
    super();
    autobind(this);
  }

  /**
   * Get list of promo codes with filters
   */
  public async getPromoCodesList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { stringedQuery } = this._getParams(req);
      const response: AxiosResponse<Success<GetListResponse<PromoCode>>> = await this.axios.get(
        getDataServiceUrl(ADMIN.PROMO.PROMO_CODES_LIST_REQUEST(stringedQuery)),
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<GetListResponse<PromoCode>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new promo code
   */
  public async createPromoCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { body } = this._getParams<CreatePromoCodeDTO>(req);
      const response: AxiosResponse<Success<PromoCode>> = await this.axios.post(
        getDataServiceUrl(ADMIN.PROMO.ROOT),
        body,
      );
      if (response.status !== 201) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<PromoCode>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle promo code activity
   */
  public async toggleActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = this._getParams(req, 'promoCodeId');
      const response: AxiosResponse<Success<PromoCode>> = await this.axios.get(
        getDataServiceUrl(ADMIN.PROMO.TOGGLE_ACTIVITY_REQUEST(id)),
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<PromoCode>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove promo code
   */
  public async removePromoCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = this._getParams(req, 'promoCodeId');
      const response: AxiosResponse<Success<null>> = await this.axios.delete(
        getDataServiceUrl(ADMIN.PROMO.REMOVE_PROMO_REQUEST(id)),
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<null>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
