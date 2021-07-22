/**
 * Description: Promo codes module repository
 */

import { CreateOptions, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IDbContext } from 'db/interfaces';
import { BaseRepository } from 'modules/common';
import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, GetParameters } from 'modules/interfaces';

import { IPromoCodeRepository } from './promo-codes.interfaces';
import { PromoCodeModel } from './promo-code.model';
import { CreatePromoCode, CreatePromoCodeUsesDTO } from './promo-codes.types';
import { PromoCodeUseModel } from './promo-code-use.model';

@injectable()
export class PromoCodeRepository extends BaseRepository implements IPromoCodeRepository {
  constructor(@inject(TYPES.DbContext) protected readonly dbContext: IDbContext) {
    super();
    autobind(this);
  }

  /**
   * Get list of promo codes
   */
  public async getPromoCodesList({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<PromoCodeModel>> {
    const codes = await this.dbContext.PromoCodeModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<PromoCodeModel>>(codes, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: codes.count }, pagination),
    };
  }

  /**
   * Get promo code
   */
  public async getPromoCode({
    where = {},
    attributes,
    include,
  }: FindOptions): Promise<PromoCodeModel | null> {
    return this.dbContext.PromoCodeModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Create promo code
   */
  public async createPromoCode(
    payload: CreatePromoCode,
    options?: CreateOptions<PromoCodeModel>,
  ): Promise<PromoCodeModel> {
    return this.dbContext.PromoCodeModel.create(payload, options);
  }

  /**
   * Update promo code
   */
  public async updatePromoCode(
    payload: Partial<CreatePromoCode>,
    options: UpdateOptions<PromoCodeModel>,
  ): Promise<[number, PromoCodeModel[]]> {
    return this.dbContext.PromoCodeModel.update(payload, options);
  }

  /**
   * Delete user by id (DEV)
   */
  public async deletePromoCode(options: DestroyOptions<PromoCodeModel>): Promise<number> {
    return this.dbContext.PromoCodeModel.destroy(options);
  }

  /**
   * Get list of promo code uses
   */
  public async getPromoCodeUsesList({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<PromoCodeUseModel>> {
    const uses = await this.dbContext.PromoCodeUseModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<PromoCodeUseModel>>(uses, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: uses.count }, pagination),
    };
  }

  /**
   * Get promo code use
   */
  public async getPromoCodeUse({
    where = {},
    attributes,
    include,
  }: FindOptions): Promise<PromoCodeUseModel | null> {
    return this.dbContext.PromoCodeUseModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Create promo code uses record
   */
  public async createPromoCodeUses(
    payload: CreatePromoCodeUsesDTO,
    options?: CreateOptions<CreatePromoCodeUsesDTO>,
  ): Promise<PromoCodeUseModel> {
    return this.dbContext.PromoCodeUseModel.create(payload, options);
  }

  /**
   * Update promo code uses record
   */
  public async updatePromoCodeUses(
    payload: Partial<CreatePromoCodeUsesDTO>,
    options: UpdateOptions<PromoCodeUseModel>,
  ): Promise<[number, PromoCodeUseModel[]]> {
    return this.dbContext.PromoCodeUseModel.update(payload, options);
  }
}
