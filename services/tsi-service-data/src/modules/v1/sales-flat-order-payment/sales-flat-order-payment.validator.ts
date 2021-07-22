/**
 * Description: Validators for the sales flat order payment service
 */

import { BaseValidator } from 'modules/common';
import { Validator, ValidatorError } from 'utils/validation';

import { CreateOrderPaymentPayload } from './types';

export class SalesFlatOrderPaymentValidator extends BaseValidator {
  /**
   * Create order payment validator
   */
  public static createOrderPaymentValidator(dto: CreateOrderPaymentPayload): void {
    const { orderId, referenceId, reason, totalPaid } = dto;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: orderId, field: 'orderId' }).required().isNumber().result(),
      ...new Validator({ value: referenceId, field: 'referenceId' }).required().result(),
      ...new Validator({ value: reason, field: 'reason' }).required().result(),
      ...new Validator({ value: totalPaid, field: 'totalPaid' }).required().isNumber().result(),
    ];

    if (errors.length) {
      SalesFlatOrderPaymentValidator.throwValidationError(errors);
    }
  }
}
