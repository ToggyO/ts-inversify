/**
 * Description: Admin - Validators for the admin service
 */

import { Validator, ValidatorError } from 'utils/validation';
import { BaseValidator } from 'modules/common';

import { LoginPayload } from 'modules/v1/user';
import { UpdateAdminDTO } from './admin-user.admin.types';

export class AdminUserAdminValidator extends BaseValidator {
  /**
   * User's login credentials validator
   */
  public static loginValidator(values: LoginPayload): void {
    const { email, password } = values;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: email, field: 'email' }).required().email().result(),
      ...new Validator({ value: password, field: 'password' }).required().result(),
    ];

    if (errors.length) {
      AdminUserAdminValidator.throwValidationError(errors);
    }
  }

  /**
   * User's login credentials validator
   */
  public static updateValidator(dto: UpdateAdminDTO): void {
    const { name, email, address, phoneNumber, postalCode } = dto;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: name, field: 'name' }).required().result(),
      ...new Validator({ value: email, field: 'email' }).required().email().result(),
      ...new Validator({ value: address, field: 'address' }).required().result(),
      ...new Validator({ value: phoneNumber, field: 'phoneNumber' }).required().phone().result(),
      ...new Validator({ value: postalCode, field: 'postalCode' }).required().result(),
    ];

    if (errors.length) {
      AdminUserAdminValidator.throwValidationError(errors);
    }
  }
}
