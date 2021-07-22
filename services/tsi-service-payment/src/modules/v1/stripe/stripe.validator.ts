/**
 * Description: Validators for the stripe payment service
 */

import { Validator, ValidatorError } from 'utils/validation';
import { BaseValidator } from 'modules/common';
import {
  CreateSinglePaymentDTO,
  CreateCustomerDTO,
  CreateCustomerPaymentDTO,
  CreatePaymentBase,
  AddCardToCustomerDTO,
} from 'utils/payment';

export class StripeValidator extends BaseValidator {
  /**
   * Create stripe customer payload validator
   */
  public static createCustomerValidator(dto: CreateCustomerDTO): void {
    const { email, firstName, lastName } = dto;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: email, field: 'email' }).required().email().result(),
      ...new Validator({ value: firstName, field: 'firstName' }).required().result(),
      ...new Validator({ value: lastName, field: 'lastName' }).required().result(),
    ];

    if (errors.length) {
      StripeValidator.throwValidationError(errors);
    }
  }

  /**
   * Create payment base payload validator
   */
  public static createPaymentBaseValidator(dto: CreatePaymentBase): void {
    const { description, amount, currency, email } = dto;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: description, field: 'description' }).required().result(),
      ...new Validator({ value: amount, field: 'amount' }).required().isNumber().result(),
      ...new Validator({ value: currency, field: 'currency' }).required().result(),
      ...new Validator({ value: email, field: 'email' }).required().email().result(),
    ];

    if (errors.length) {
      StripeValidator.throwValidationError(errors);
    }
  }

  /**
   * Create payment for unauthorized user payload validator
   */
  public static createSinglePaymentValidator(dto: CreateSinglePaymentDTO): void {
    StripeValidator.createPaymentBaseValidator(dto);

    const { cardToken } = dto;
    const errors: Array<ValidatorError> = [
      ...new Validator({ value: cardToken, field: 'cardToken' }).required().result(),
    ];

    if (errors.length) {
      StripeValidator.throwValidationError(errors);
    }
  }

  /**
   * Validate single parameter as required
   */
  public static requiredParameterValidator<T>(key: string, value: T): void {
    const errors: Array<ValidatorError> = [
      ...new Validator({ value: value, field: key }).required().result(),
    ];

    if (errors.length) {
      StripeValidator.throwValidationError(errors);
    }
  }

  /**
   * Attack payment card to customer payload validator
   */
  public static addToCardToCustomerPayloadValidator(dto: AddCardToCustomerDTO): void {
    const { cardId, stripeCustomerToken } = dto;
    const errors: Array<ValidatorError> = [
      ...new Validator({ value: cardId, field: 'cardId' }).required().result(),
      ...new Validator({ value: stripeCustomerToken, field: 'stripeCustomerToken' }).required().result(),
    ];

    if (errors.length) {
      StripeValidator.throwValidationError(errors);
    }
  }

  /**
   * Create payment for authorized customer payload validator
   */
  public static createCustomerPaymentValidator(dto: CreateCustomerPaymentDTO): void {
    StripeValidator.createPaymentBaseValidator(dto);
    StripeValidator.addToCardToCustomerPayloadValidator(dto);
  }
}
