/**
 * Description: Validators for the city service
 */

import { BaseValidator } from 'modules/common';
import { Validator, ValidatorError } from 'utils/validation';

import { UpdateCityTopPayload } from './types';

export class CityValidator extends BaseValidator {
  /**
   * Update city `top` validator
   */
  public static updateTopValidator(values: UpdateCityTopPayload): void {
    const { topDestination, topToVisit } = values;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: topDestination, field: 'topDestination' }).required().isBoolean().result(),
      ...new Validator({ value: topToVisit, field: 'topToVisit' }).required().isBoolean().result(),
    ];

    if (errors.length) {
      CityValidator.throwValidationError(errors);
    }
  }
}
