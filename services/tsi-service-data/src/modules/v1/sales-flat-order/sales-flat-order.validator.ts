/**
 * Description: Validators for the sales flat order service
 */

import { BaseValidator } from 'modules/common';
import { Validator, ValidatorError } from 'utils/validation';

import { CreateOrderPayload, BookOrderItemsUpdateOrderPayload } from './types';

export class SalesFlatOrderValidator extends BaseValidator {
  /**
   * Create order with items validator
   */
  public static createOrderValidator(dto: CreateOrderPayload): void {
    const { userName, userEmail, userPhone } = dto;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: userName, field: 'userName' }).required().result(),
      ...new Validator({ value: userEmail, field: 'userEmail' }).required().email().result(),
      ...new Validator({ value: userPhone, field: 'userPhone' }).required().phone().result(),
    ];

    if (errors.length) {
      SalesFlatOrderValidator.throwValidationError(errors);
    }
  }

  /**
   * Update order with items validator
   */
  public static updateOrderValidator(dto: BookOrderItemsUpdateOrderPayload): void {
    const { orderId } = dto;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: orderId, field: 'orderId' }).required().isNumber().result(),
    ];

    if (errors.length) {
      SalesFlatOrderValidator.throwValidationError(errors);
    }
  }
}
