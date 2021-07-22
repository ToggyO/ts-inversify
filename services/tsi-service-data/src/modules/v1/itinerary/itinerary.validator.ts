/**
 * Description: Validators for the itinerary service
 */

import { BaseValidator } from 'modules/common';
import { Validator, ValidatorError } from 'utils/validation';

import { ManageItineraryDTO, AgeGroupOptions, UpdateItemOfItineraryDTO } from './types';

export class ItineraryValidator extends BaseValidator {
  /**
   * Age group options validator
   */
  private static ageGroupOptionsValidator(ageGroupOptions: Array<AgeGroupOptions>): Array<ValidatorError> {
    return ageGroupOptions.reduce((acc: Array<ValidatorError>, item: AgeGroupOptions) => {
      const errors: Array<ValidatorError> = [
        ...new Validator({ value: item.name, field: 'name' }).required().result(),
        ...new Validator({ value: item.orderedQty, field: 'orderedQty' }).required().isNumber().result(),
        ...new Validator({ value: item.originalPrice, field: 'originalPrice' })
          .required()
          .isNumber()
          .result(),
        ...new Validator({ value: item.totalPrice, field: 'totalPrice' }).required().isNumber().result(),
        ...new Validator({ value: item.ageFrom, field: 'ageFrom' }).required(false).isNumber().result(),
        ...new Validator({ value: item.ageTo, field: 'ageTo' }).required(false).isNumber().result(),
      ];
      return [...acc, ...errors];
    }, []);
  }

  /**
   * Update city `top` validator
   */
  public static manageItineraryValidator(values: ManageItineraryDTO): void {
    const {
      itineraryDate,
      variantId,
      headoutVariantId,
      productId,
      variantItemId,
      headoutVariantItemId,
      slotDateTime,
      ageGroupOptions,
    } = values;

    const ArrayValidationErrors: Array<ValidatorError> = ItineraryValidator.ageGroupOptionsValidator(
      ageGroupOptions,
    );

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: itineraryDate, field: 'itineraryDate' }).required().result(),
      ...new Validator({ value: variantId, field: 'variantId' }).required().result(),
      ...new Validator({ value: headoutVariantId, field: 'headoutVariantId' }).required().result(),
      ...new Validator({ value: productId, field: 'productId' }).required().result(),
      ...new Validator({ value: variantItemId, field: 'variantItemId' }).required().result(),
      ...new Validator({ value: headoutVariantItemId, field: 'headoutVariantItemId' }).required().result(),
      ...new Validator({ value: slotDateTime, field: 'slotDateTime' }).required().result(),
      ...ArrayValidationErrors,
    ];

    if (errors.length) {
      ItineraryValidator.throwValidationError(errors);
    }
  }

  /**
   * Update itinerary items validator
   */
  public static updateItineraryValidator(dto: UpdateItemOfItineraryDTO): void {
    const { itineraryId, itineraryItem } = dto;

    const ArrayValidationErrors: Array<ValidatorError> = ItineraryValidator.ageGroupOptionsValidator(
      itineraryItem.ageGroupOptions,
    );

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: itineraryId, field: 'itineraryId' }).required().result(),
      ...new Validator({ value: itineraryItem.id, field: 'itineraryItem.id' }).required().result(),
      ...ArrayValidationErrors,
    ];

    if (errors.length) {
      ItineraryValidator.throwValidationError(errors);
    }
  }
}
