/**
 * Description: Admin - Promo codes module interfaces
 */

import { NextFunction, Request, Response } from 'express';

import { GetEntityPayload, GetEntityResponse, GetListResponse, RequestQueries } from 'modules/interfaces';

import { PromoCodeModel } from '../../promo-code/promo-code.model';
import { CreatePromoCodeDTO } from 'modules/v1/promo-code';

export interface IPromoCodeHandler {
  getPromoCodesList(req: Request, res: Response, next: NextFunction): Promise<void>;
  createPromoCode(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleActivity(req: Request, res: Response, next: NextFunction): Promise<void>;
  removePromoCode(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IPromoCodeAdminService {
  getEntityResponse(payload: GetEntityPayload): Promise<GetEntityResponse<PromoCodeModel>>;
  getPromoCodesList(query: RequestQueries): Promise<GetListResponse<PromoCodeModel>>;
  createPromoCode(dto: CreatePromoCodeDTO): Promise<number>;
  toggleActivity(promoCodeId: number): Promise<void>;
  removePromoCode(promoCodeId: number): Promise<number>;
}
