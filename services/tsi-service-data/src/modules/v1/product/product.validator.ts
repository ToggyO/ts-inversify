/**
 * Description: Validators for the city service
 */

import { BaseValidator } from 'modules/common';
import { Validator, ValidatorError } from 'utils/validation';

import { GetVariantItemsDTO, GetVariantMetaInfoDTO, UpdateProductTopDTO } from './types';

export class ProductValidator extends BaseValidator {
  /**
   * Update city `top` validator
   */
  public static updateTopValidator(values: UpdateProductTopDTO): void {
    const { topActivities, mostPopular } = values;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: topActivities, field: 'topActivities' }).required().isBoolean().result(),
      ...new Validator({ value: mostPopular, field: 'mostPopular' }).required().isBoolean().result(),
    ];

    if (errors.length) {
      ProductValidator.throwValidationError(errors);
    }
  }

  /**
   * Date validator
   */
  public static dateValidator(date: string | null): void {
    const errors: Array<ValidatorError> = [
      ...new Validator({ value: date, field: 'date' })
        .required()
        .dateFormat({ expectedFormat: 'YYYY-MM-DD' })
        .result(),
    ];

    if (errors.length) {
      ProductValidator.throwValidationError(errors);
    }
  }

  /**
   * Get variants payload validator
   */
  public static getVariantDataValidator(variantId: number, variantItemId: number): void {
    const errors: Array<ValidatorError> = [
      ...new Validator({ value: variantId, field: 'variantId' }).required().isNumber().result(),
      ...new Validator({ value: variantItemId, field: 'variantItemId' }).required().isNumber().result(),
    ];

    if (errors.length) {
      ProductValidator.throwValidationError(errors);
    }
  }

  /**
   * Get variant items payload validator
   */
  public static getVariantItemsValidator(dto: GetVariantItemsDTO): void {
    const { productId, variantId, sourceId, date } = dto;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: productId, field: 'productId' }).required().isNumber().result(),
      ...new Validator({ value: variantId, field: 'variantId' }).required().isNumber().result(),
      ...new Validator({ value: sourceId, field: 'sourceId' }).required().isNumber().result(),
      ...new Validator({ value: date, field: 'date' })
        .required()
        .dateFormat({ expectedFormat: 'YYYY-MM-DD' })
        .result(),
    ];

    if (errors.length) {
      ProductValidator.throwValidationError(errors);
    }
  }

  /**
   * Get variant item meta info payload validator
   */
  public static getVariantItemMetaInfovalidator(dto: GetVariantMetaInfoDTO): void {
    ProductValidator.getVariantItemsValidator(dto);

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: dto.variantItemId, field: 'variantItemId' }).required().isNumber().result(),
    ];

    if (errors.length) {
      ProductValidator.throwValidationError(errors);
    }
  }
}
