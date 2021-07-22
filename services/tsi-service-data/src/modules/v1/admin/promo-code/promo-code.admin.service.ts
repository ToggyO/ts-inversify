/**
 * Description: Admin - Promo codes module service
 */

import { Op } from 'sequelize';
import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseService } from 'modules/common';

import { autobind } from 'utils/helpers';
import { GetEntityPayload, GetEntityResponse, GetListResponse, RequestQueries } from 'modules/interfaces';
import { ApplicationError } from 'utils/response';
import { ERROR_CODES } from 'constants/error-codes';

import { CreatePromoCodeDTO, IPromoCodeRepository } from 'modules/v1/promo-code';
import { IPromoCodeAdminService } from './promo-code.admin.interfaces';
import { PromoCodeAdminValidator } from './promo-code.admin.validator';
import { PromoCodeModel } from '../../promo-code/promo-code.model';
import { PROMO_ERROR_MESSAGES } from './promo-code.admin.constants';

@injectable()
export class PromoCodeAdminService extends BaseService implements IPromoCodeAdminService {
  constructor(@inject(TYPES.IPromoCodeRepository) private readonly _repository: IPromoCodeRepository) {
    super();
    autobind(this);
  }

  /**
   * Get a promo code as a common answer
   * on operations of creating / editing / getting by id
   */
  public async getEntityResponse({
    id,
    include,
  }: GetEntityPayload): Promise<GetEntityResponse<PromoCodeModel>> {
    const model = PromoCodeModel;
    const attributes = this.getModelAttributes<typeof PromoCodeModel>({ model });
    const result = await this._repository.getPromoCode({
      where: { id },
      attributes,
      include,
    });

    return this.dryDataWithInclude({ model, data: result });
  }

  /**
   * Get list of promo codes with filters
   */
  public async getPromoCodesList(query: RequestQueries): Promise<GetListResponse<PromoCodeModel>> {
    const pagination = this.getPagination({ query });
    const search = this.getSearch({ query, fieldNames: ['couponName'] });
    const order = this.getSort({ query });
    const { startDateStartRange, startDateEndRange } = query;

    const attributes = this.getModelAttributes<typeof PromoCodeModel>({ model: PromoCodeModel });

    return this._repository.getPromoCodesList({
      where: {
        ...(search ? { [Op.or]: search } : {}),
        ...this.getRangeFilter<string>('startDate', startDateStartRange, startDateEndRange),
      },
      pagination,
      attributes,
      order: order.length ? order : undefined,
    });
  }

  /**
   * Create new promo code
   */
  public async createPromoCode(dto: CreatePromoCodeDTO): Promise<number> {
    const driedValues = this.dryPayload<CreatePromoCodeDTO>(dto, this._createUpdatePromoCodePayloadSchema());
    let code = await this._repository.getPromoCode({ where: { promoCode: driedValues.promoCode } });
    if (code) {
      throw new ApplicationError({
        statusCode: 409,
        errorCode: ERROR_CODES.conflict,
        errorMessage: PROMO_ERROR_MESSAGES.EXISTS,
        errors: [],
      });
    }
    PromoCodeAdminValidator.createPromoCodeValidator(driedValues);
    code = await this._repository.createPromoCode({
      ...driedValues,
      availableDays: JSON.stringify({ data: driedValues.availableDays }),
      status: 1,
      // FIXME: !!!!!!!!!!
      generationType: 'A',
    });
    return code!.id;
  }

  /**
   * Toggle promo code activity
   */
  public async toggleActivity(promoCodeId: number): Promise<void> {
    const code = await this._checkPromoCodeExistence(promoCodeId);
    const status = code.status === 1 ? 0 : 1;
    await this._repository.updatePromoCode({ status }, { where: { id: promoCodeId } });
  }

  /**
   * Remove promo code
   */
  public async removePromoCode(promoCodeId: number): Promise<number> {
    await this._checkPromoCodeExistence(promoCodeId);
    return this._repository.deletePromoCode({ where: { id: promoCodeId } });
  }

  /**
   * Get promo code by id or throw `not found exception`
   */
  private async _checkPromoCodeExistence(promoCodeId: number): Promise<PromoCodeModel> {
    const code = await this.getEntityResponse({ id: promoCodeId });
    if (!code) {
      throw new ApplicationError({
        statusCode: 404,
        errorCode: ERROR_CODES.not_found,
        errorMessage: PROMO_ERROR_MESSAGES.NOT_FOUND('Promo code'),
        errors: [],
      });
    }
    return code;
  }

  /**
   * Data transformation schema for create/update promo code payload
   */
  private _createUpdatePromoCodePayloadSchema() {
    return {
      couponName: (value: string) => value,
      promoCode: (value: string) => value,
      tAndC: (value: boolean): boolean => value,
      couponType: (value: boolean): boolean => value,
      couponValue: (value: boolean): boolean => value,
      couponQty: (value: number): number => value,
      availableDays: (value: string[]): string[] => value,
      startDate: (value: boolean): boolean => value,
      endDate: (value: boolean): boolean => value,
      startTime: (value: boolean): boolean => value,
      endTime: (value: boolean): boolean => value,
      includeApiData: (value: boolean): boolean => value,
      userRedemptionLimit: (value: boolean): boolean => value,
      minCartAmount: (value: boolean): boolean => value,
    };
  }
}
