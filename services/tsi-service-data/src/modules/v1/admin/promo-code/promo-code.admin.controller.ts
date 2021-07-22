/**
 * Description: Admin - Promo codes module controller
 */

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { GetListResponse, RequestQueries } from 'modules/interfaces';
import { getSuccessRes } from 'utils/response';
import { getProp, autobind } from 'utils/helpers';
import { PromoCodeModel } from 'modules/v1/promo-code/promo-code.model';
import { CreatePromoCodeDTO } from 'modules/v1/promo-code';

import { IPromoCodeAdminService, IPromoCodeHandler } from './promo-code.admin.interfaces';

@injectable()
export class PromoCodeAdminController extends BaseController implements IPromoCodeHandler {
  constructor(@inject(TYPES.IPromoCodeAdminService) private readonly _adminService: IPromoCodeAdminService) {
    super();
    autobind(this);
  }

  /**
   * Get list of promo codes with filters
   */
  public async getPromoCodesList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = this._getParams(req, 'promoCodeId');
      const resultData = await this._adminService.getPromoCodesList(query);
      res.status(200).send(
        getSuccessRes<GetListResponse<PromoCodeModel>>({ resultData }),
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
      const { body } = this._getParams<CreatePromoCodeDTO>(req, 'promoCodeId');
      const promoCodeId = await this._adminService.createPromoCode(body);
      const resultData = await this._adminService.getEntityResponse({ id: promoCodeId });
      res.status(201).send(
        getSuccessRes<PromoCodeModel>({ resultData }),
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
      await this._adminService.toggleActivity(id);
      const resultData = await this._adminService.getEntityResponse({ id });
      res.status(200).send(
        getSuccessRes<PromoCodeModel>({ resultData }),
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
      await this._adminService.removePromoCode(id);
      res.status(200).send(
        getSuccessRes<null>({ resultData: null }),
      );
    } catch (error) {
      next(error);
    }
  }
}
