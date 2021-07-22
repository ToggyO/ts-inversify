/**
 * Description: Validators for the user service
 */

import { Validator, ValidatorError } from 'utils/validation';
import { BaseValidator } from 'modules/common';

import {
  ChangePasswordDTO,
  CreateUserDTO,
  CreteUserBasePayload,
  LoginPayload,
  UpdateUserDTO,
  UserFavouritesPayload,
  VerifyEmailPayload,
  ResetPasswordDTO,
  UpdateSocialNetworkUserDTO,
} from './types';
import { SOCIAL_TYPES } from 'constants/social-types';

export class UserValidator extends BaseValidator {
  /**
   * Create user base validator
   */
  public static createUserBaseValidator(values: CreteUserBasePayload): void {
    const { firstName, lastName, email } = values;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: firstName, field: 'firstName' }).required().result(),
      ...new Validator({ value: lastName, field: 'lastName' }).required().result(),
      // ...new Validator({ value: countryId, field: 'countryId' }).required().isNumber().result(),
      ...new Validator({ value: email, field: 'email' }).required().email().result(),
    ];

    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }

  /**
   * Create user with email validator
   */
  public static createUserWithEmailValidator(values: CreateUserDTO): void {
    const { phoneNumber, password, ...rest } = values;

    UserValidator.createUserBaseValidator(rest);

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: phoneNumber, field: 'phoneNumber' }).required().phone().result(),
      ...new Validator({ value: password, field: 'password' })
        .required()
        .minLength(6)
        .maxLength(30)
        .password()
        .result(),
    ];

    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }

  /**
   * Create user validator with social network
   */
  public static createUserWithSocialNetworkValidator(values: CreateUserDTO): void {
    const { socialId, socialType, ...rest } = values;

    UserValidator.createUserBaseValidator(rest);

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: socialId, field: 'socialId' }).required().result(),
      ...new Validator({ value: socialType, field: 'socialType' })
        .required()
        .enumeration([SOCIAL_TYPES.GOOGLE, SOCIAL_TYPES.FACEBOOK])
        .result(),
    ];

    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }

  /**
   * Update user validator
   */
  public static updateUserValidator(values: UpdateUserDTO): void {
    const { firstName, lastName, dob, phoneNumber } = values;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: firstName, field: 'firstName' }).required().result(),
      ...new Validator({ value: lastName, field: 'lastName' }).required().result(),
      ...new Validator({ value: dob, field: 'dob' }).required().dateFormat().result(),
      ...new Validator({ value: phoneNumber, field: 'phoneNumber' }).required().result(),
    ];

    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }

  /**
   * Update social network user validator
   */
  public static updateSocialNetworkUserValidator(values: UpdateSocialNetworkUserDTO): void {
    const { dob, phoneNumber } = values;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: dob, field: 'dob' }).required().dateFormat().result(),
      ...new Validator({ value: phoneNumber, field: 'phoneNumber' }).required().result(),
    ];

    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }

  /**
   * Check otp code field validator
   */
  public static checkOtpCodeValidator(values: VerifyEmailPayload): void {
    const { otp } = values;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: otp, field: 'otp' }).required().result(),
    ];

    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }

  /**
   * User's login credentials validator
   */
  public static loginValidator(values: LoginPayload): void {
    const { email, password } = values;

    const errors = [
      ...new Validator({ value: email, field: 'email' }).required().email().result(),
      ...new Validator({ value: password, field: 'password' }).required().password().result(),
    ];

    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }

  /**
   * User's favourites payload validator
   */
  public static checkFavouritesPayloadValidator(values: UserFavouritesPayload): void {
    const { userId, productId, action } = values;

    const errors = [
      ...new Validator({ value: userId, field: 'userId' }).required().isNumber().result(),
      ...new Validator({ value: productId, field: 'productId' }).required().isNumber().result(),
      ...new Validator({ value: action, field: 'action' }).required().result(),
    ];

    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }

  /**
   * Change user's email payload validator
   */
  public static changeEmailValidator(email: string): void {
    const errors: Array<ValidatorError> = [
      ...new Validator({ value: email, field: 'email' }).required().email().result(),
    ];
    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }

  /**
   * Change user's password payload validator
   */
  public static changePasswordValidator(dto: ChangePasswordDTO): void {
    const { id, oldPassword, newPassword } = dto;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: id, field: 'id' }).required().isNumber().result(),
      ...new Validator({ value: oldPassword, field: 'oldPassword' }).required().result(),
      ...new Validator({ value: newPassword, field: 'newPassword' }).required().password().result(),
    ];

    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }

  /**
   * Change user's password payload validator
   */
  public static resetPasswordValidator(dto: ResetPasswordDTO): void {
    const { token, password } = dto;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: token, field: 'token' }).required().result(),
      ...new Validator({ value: password, field: 'password' }).required().password().result(),
    ];

    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }

  /**
   * Generate restore password token validator
   */
  public static restorePasswordValidator(email: string): void {
    const errors: Array<ValidatorError> = [
      ...new Validator({ value: email, field: 'email' }).required().email().result(),
    ];

    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }

  /**
   * Update stripe customer token validator
   */
  public static updateStripeCustomerTokenValidator(token: string): void {
    const errors: Array<ValidatorError> = [
      ...new Validator({ value: token, field: 'stripeCustomerToken' }).required().result(),
    ];

    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }

  /**
   * Update profile image validator
   */
  public static updateProfileImageValidator(profileImageUrl: string): void {
    const errors: Array<ValidatorError> = [
      ...new Validator({ value: profileImageUrl, field: 'profileImage' }).required().result(),
    ];

    if (errors.length) {
      UserValidator.throwValidationError(errors);
    }
  }
}
