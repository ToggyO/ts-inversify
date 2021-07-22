/**
 * Description: Sales flat orders module service
 */

import moment from 'moment';
import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseService } from 'modules/common';
import { ApplicationError } from 'utils/response';
import { autobind } from 'utils/helpers';
import { ERROR_CODES } from 'constants/error-codes';
import { IConnector } from 'db/interfaces';
import { CustomersIds } from 'modules/v1/user';
import { ValidatorError } from 'utils/validation';
import { PromoCodeTypes } from 'constants/common';

import { IPromoCodeEntityService, IPromoCodeRepository } from './promo-codes.interfaces';
import { PROMO_ERROR_MESSAGES } from './promo-code.constants';
import { PromoCodeModel } from './promo-code.model';
import { DiscountDTO } from './promo-codes.types';

@injectable()
export class PromoCodeService extends BaseService implements IPromoCodeEntityService {
  constructor(
    @inject(TYPES.IConnector) private readonly _connector: IConnector,
    @inject(TYPES.IPromoCodeRepository) private readonly _repository: IPromoCodeRepository,
  ) {
    super();
    autobind(this);
  }

  /**
   * Check if promo code is valid and return discount amount
   */
  public async getDiscountPercent(
    promoCode: string,
    subTotal: number,
    customerIds: CustomersIds,
  ): Promise<DiscountDTO> {
    const coupon = await this._repository.getPromoCode({ where: { promoCode } });
    if (!coupon) {
      throw new ApplicationError({
        statusCode: 404,
        errorCode: ERROR_CODES.not_found,
        errorMessage: PROMO_ERROR_MESSAGES.NOT_FOUND,
        errors: [],
      });
    }

    const { userId, guestId } = customerIds;
    const isCodeUsedByCustomer = await this._repository.getPromoCodeUse({
      where: {
        promoCodeId: coupon.id,
        ...(userId ? { userId } : { guestId }),
      },
    });
    if (isCodeUsedByCustomer) {
      throw new ApplicationError({
        statusCode: 409,
        errorCode: ERROR_CODES.conflict,
        errorMessage: PROMO_ERROR_MESSAGES.ALREADY_USED,
        errors: [],
      });
    }

    this._validatePromoCode(coupon, subTotal);
    return {
      discountAmount: coupon.couponValue,
      discountType:
        coupon.couponType === PromoCodeTypes.FixedPercentage
          ? PromoCodeTypes.FixedPercentage
          : PromoCodeTypes.FlatValue,
    };
  }

  /**
   * Increment promo code uses count
   */
  public async usePromoCode(promoCode: string, customerIds: CustomersIds): Promise<void> {
    const coupon = await this._repository.getPromoCode({ where: { promoCode } });
    if (coupon) {
      const t = await this._connector.getConnection()?.transaction();
      if (!t) {
        return;
      }
      try {
        await this._repository.updatePromoCode(
          { usesCount: coupon.usesCount + 1 },
          {
            where: { id: coupon.id },
            transaction: t,
          },
        );
        const { userId, guestId } = customerIds;
        await this._repository.createPromoCodeUses(
          {
            ...(userId ? { userId } : { guestId }),
            promoCodeId: coupon.id,
            usesCount: 1,
          },
          { transaction: t },
        );
        await t.commit();
      } catch (error) {
        await t.rollback();
      }
    }
  }

  /**
   * Validate promo code
   */
  private _validatePromoCode(promoCode: PromoCodeModel, subTotal: number): void {
    if (promoCode.usesCount >= promoCode.userRedemptionLimit) {
      throw new ApplicationError({
        statusCode: 409,
        errorCode: ERROR_CODES.conflict,
        errorMessage: PROMO_ERROR_MESSAGES.INVALID,
        errors: [],
      });
    }

    const now = moment();
    const startDate = moment(`${promoCode.startDate} ${promoCode.startTime}`);
    const endDate = moment(`${promoCode.endDate} ${promoCode.endTime}`);
    const currentDayOfTheWeek = moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('ddd');

    const isNotAvailableDayOfTheWeek =
      !promoCode.availableDays.data.includes(currentDayOfTheWeek) &&
      PROMO_ERROR_MESSAGES.UNAVAILABLE_DAY_OF_THE_WEEK;

    const isMinCartAmountLimitNotReached =
      subTotal < promoCode.minCartAmount && PROMO_ERROR_MESSAGES.MIN_CART_AMOUNT(promoCode.minCartAmount);

    const isNotValidUsageDate =
      !now.isAfter(startDate) && !now.isBefore(endDate) && PROMO_ERROR_MESSAGES.INVALID_USAGE_DATE;

    const errors = [isNotAvailableDayOfTheWeek, isMinCartAmountLimitNotReached, isNotValidUsageDate].reduce(
      (acc, error) => {
        if (error) {
          acc.push({
            field: 'promoCode',
            errorCode: ERROR_CODES.validation,
            errorMessage: error as string,
          });
        }
        return acc;
      },
      [] as Array<ValidatorError>,
    );

    if (errors.length) {
      throw new ApplicationError({
        statusCode: 400,
        errorCode: ERROR_CODES.validation,
        errorMessage: PROMO_ERROR_MESSAGES.INVALID,
        errors,
      });
    }
  }
}
