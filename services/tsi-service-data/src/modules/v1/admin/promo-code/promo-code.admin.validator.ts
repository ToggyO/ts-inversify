/**
 * Description: Admin - Validators for the promo codes service
 */

import { BaseValidator } from 'modules/common';
import { Validator, ValidatorError } from 'utils/validation';
import { CreatePromoCodeDTO } from 'modules/v1/promo-code';
import { PromoCodeTypes } from 'constants/common';

export class PromoCodeAdminValidator extends BaseValidator {
  /**
   * Create new promo code validator
   */
  public static createPromoCodeValidator(dto: CreatePromoCodeDTO): void {
    const {
      couponName,
      promoCode,
      tAndC,
      couponType,
      couponValue,
      couponQty,
      availableDays,
      startDate,
      endDate,
      startTime,
      endTime,
      includeApiData,
      userRedemptionLimit,
      minCartAmount,
    } = dto;
    const errors: Array<ValidatorError> = [
      ...new Validator({ value: couponName, field: 'couponName' }).required().result(),
      ...new Validator({ value: promoCode, field: 'promoCode' }).required().result(),
      ...new Validator({ value: tAndC, field: 'tAndC' }).required().result(),
      ...new Validator({ value: couponType, field: 'couponType' })
        .required()
        .enumeration<PromoCodeTypes>([PromoCodeTypes.FlatValue, PromoCodeTypes.FixedPercentage])
        .result(),
      ...new Validator({ value: couponValue, field: 'couponValue' }).required().isNumber().result(),
      ...new Validator({ value: couponQty, field: 'couponQty' }).required().isNumber().result(),
      ...new Validator({ value: availableDays, field: 'availableDays' })
        .required()
        .specificArrayValues(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
        .result(),
      ...new Validator({ value: startDate, field: 'startDate' })
        .required()
        .dateFormat({ expectedFormat: 'YYYY-MM-DD' })
        .result(),
      ...new Validator({ value: endDate, field: 'endDate' })
        .required()
        .dateFormat({ expectedFormat: 'YYYY-MM-DD' })
        .result(),
      ...new Validator({ value: startTime, field: 'startTime' }).required().result(),
      ...new Validator({ value: endTime, field: 'endTime' }).required().result(),
      ...new Validator({ value: includeApiData, field: 'includeApiData' }).required().isBoolean().result(),
      ...new Validator({ value: userRedemptionLimit, field: 'userRedemptionLimit' })
        .required()
        .isNumber()
        .result(),
      ...new Validator({ value: minCartAmount, field: 'minCartAmount' }).required().isNumber().result(),
    ];
    if (errors.length) {
      PromoCodeAdminValidator.throwValidationError(errors);
    }
  }
}
