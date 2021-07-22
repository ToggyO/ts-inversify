/**
 * Description: Interfaces for promo-codes entity
 */

import { CreateOptions, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';

import { GetListResponse, GetParameters } from 'modules/interfaces';
import { CustomersIds } from 'modules/v1/user';

import { PromoCodeModel } from './promo-code.model';
import { CreatePromoCode, CreatePromoCodeUsesDTO, DiscountDTO } from './promo-codes.types';
import { PromoCodeUseModel } from './promo-code-use.model';

export interface IPromoCodeEntityService {
  getDiscountPercent(promoCode: string, subTotal: number, customerIds: CustomersIds): Promise<DiscountDTO>;
  usePromoCode(promoCode: string, customerIds: CustomersIds): Promise<void>;
}

export interface IPromoCodeRepository {
  getPromoCodesList(payload: GetParameters): Promise<GetListResponse<PromoCodeModel>>;
  getPromoCode(payload: FindOptions): Promise<PromoCodeModel | null>;
  createPromoCode(payload: CreatePromoCode, options?: CreateOptions<PromoCodeModel>): Promise<PromoCodeModel>;
  updatePromoCode(
    payload: Partial<CreatePromoCode>,
    options: UpdateOptions<PromoCodeModel>,
  ): Promise<[number, PromoCodeModel[]]>;
  deletePromoCode(options: DestroyOptions<PromoCodeModel>): Promise<number>;
  getPromoCodeUsesList(payload: GetParameters): Promise<GetListResponse<PromoCodeUseModel>>;
  getPromoCodeUse(payload: FindOptions): Promise<PromoCodeUseModel | null>;
  createPromoCodeUses(
    payload: CreatePromoCodeUsesDTO,
    options?: CreateOptions<CreatePromoCodeUsesDTO>,
  ): Promise<PromoCodeUseModel>;
  updatePromoCodeUses(
    payload: Partial<CreatePromoCodeUsesDTO>,
    options: UpdateOptions<PromoCodeUseModel>,
  ): Promise<[number, PromoCodeUseModel[]]>;
}
