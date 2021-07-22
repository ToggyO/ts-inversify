/**
 * Description: The helper class (and the function that initializes it)
 * to validate the input parameters of requests
 */

import validator from 'validator';

import { VALIDATION_ERRORS } from 'constants/validation-errors';

import {
  ArrayItemsType,
  DateFormatValidation,
  ValidatorConstructorParameters,
  ValidatorError,
} from './types';

export class Validator {
  protected error: ValidatorError | null;
  protected value: any;
  protected field: string;
  protected additionalParams: Record<string, any>;

  /**
   * A constant that determines whether the error array should be returned empty
   */
  protected shouldReturnEmptyError = false;

  constructor({
    value,
    field,
    shouldTrimValue = true,
    additionalParams = {},
  }: ValidatorConstructorParameters) {
    this.error = null;
    this.value = shouldTrimValue && typeof value === 'string' ? value.trim() : value;
    this.field = field;
    this.additionalParams = additionalParams;
  }

  /**
   * Set new error as result of validation
   */
  private setNewError = ({ field, errorCode, errorMessage }: ValidatorError): void => {
    this.error = {
      field,
      errorCode,
      errorMessage,
    };
  };

  /**
   * return validation result
   */
  public result(): Array<ValidatorError> {
    if (this.shouldReturnEmptyError) {
      return [];
    }
    return this.error ? [this.error] : [];
  }

  /**
   * Validation: optional parameter
   * Stops the validation chain when the validation value is empty
   */
  public notRequired(): this {
    if (!this.value && this.value !== false) {
      this.shouldReturnEmptyError = true;
    }
    return this;
  }

  /**
   * Validation: required parameter
   */
  public required = (required = true): this => {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (!required) {
      this.notRequired();
      return this;
    }
    if (!this.value && this.value !== false && this.value !== 0) {
      this.setNewError(VALIDATION_ERRORS.requiredField({ field: this.field }));
    }
    return this;
  };

  /**
   * Validation: value is a number
   */
  public isNumber(): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (isNaN(this.value)) {
      this.setNewError(VALIDATION_ERRORS.isNumber({ field: this.field }));
    }
    return this;
  }

  /**
   * Validation: the value contains only numbers
   */
  public isContainsOnlyNumbers(): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (!/^\d+$/.test(this.value)) {
      this.setNewError(VALIDATION_ERRORS.isContainsOnlyNumbers({ field: this.field }));
    }
    return this;
  }

  /**
   * Validation: value is an array
   */
  public isArray(itemsType?: ArrayItemsType): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (!Array.isArray(this.value)) {
      this.setNewError(VALIDATION_ERRORS.isArray({ field: this.field }));
    }
    if (itemsType && this.value.some((item: string): boolean => typeof item !== itemsType)) {
      this.setNewError(VALIDATION_ERRORS.isAllItemsOfType({ field: this.field, itemType: itemsType }));
    }
    return this;
  }

  /**
   * Validation: value is boolean
   */
  public isBoolean(): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (typeof this.value !== 'boolean') {
      this.setNewError(VALIDATION_ERRORS.isBoolean({ field: this.field }));
    }
    return this;
  }

  /**
   * Validation: correct email
   */
  public email(): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (!validator.isEmail(this.value)) {
      this.setNewError(VALIDATION_ERRORS.invalidEmailFormat({ field: this.field }));
    }
    return this;
  }

  /**
   * Validation: password format
   */
  public password(): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    // const patternNums = /[0-9]+/;
    // const patternLowSyms = /[a-z]+/;
    // const patternUppSyms = /[A-Z]+/;
    // const patternMinLen = /.{8,}/;
    // const isValid = (patternNums.test(this.value) && patternLowSyms.test(this.value)
    // && patternUppSyms.test(this.value) && patternMinLen.test(this.value)); // eslint-disable-line max-len
    // const isValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(this.value);
    const isValid = /^[0-9a-zA-Z~!@#$%^&*_\-+=`|(){}[\]:;"'<>,.?/]+$/.test(this.value);

    if (!isValid) {
      this.setNewError(VALIDATION_ERRORS.isInvalidPasswordFormat({ field: this.field }));
    }
    return this;
  }

  /**
   * Validation: is enum contains value
   */
  public enumeration<E>(enumeration: Array<E>): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }

    const isValid = enumeration.includes(this.value);

    if (!isValid) {
      this.setNewError(VALIDATION_ERRORS.invalidEnumValue({ field: this.field, enumeration }));
    }
    return this;
  }

  /**
   * Validation: Check Date for format and for entry into an interval
   */
  public dateFormat(minDate?: string, maxDate?: string): this;
  public dateFormat({ minDate, maxDate, expectedFormat }: DateFormatValidation): this;
  public dateFormat(arg1?: string | DateFormatValidation, arg2?: string): this {
    let minDate = null;
    let maxDate = null;
    let expectedFormat = null;

    if (typeof arg1 === 'object') {
      minDate = arg1.minDate;
      maxDate = arg1.maxDate;
      expectedFormat = arg1.expectedFormat;
    }

    if (typeof arg1 === 'string' && arg1) {
      minDate = arg1;
    }

    if (typeof arg2 === 'string') {
      maxDate = arg2;
    }

    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }

    const testDate = new Date(this.value).getTime();
    if (Number.isNaN(testDate)) {
      this.setNewError({
        ...VALIDATION_ERRORS.invalidDateFormat({ field: this.field, expectedFormat }),
      });
      return this;
    }

    const minDateTS = minDate ? new Date(minDate).getTime() : 0;
    const maxDateTS = maxDate ? new Date(maxDate).getTime() : 0;

    if (minDateTS && minDateTS > testDate) {
      this.setNewError({
        ...VALIDATION_ERRORS.invalidDateFormat({ field: this.field, minDate, expectedFormat }),
      });
    }

    if (maxDateTS && maxDateTS < testDate) {
      this.setNewError({
        ...VALIDATION_ERRORS.invalidDateFormat({ field: this.field, maxDate, expectedFormat }),
      });
    }

    return this;
  }

  /**
   * Validation: Minimum length
   */
  public minLength(minLength: number): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if ((this.value || this.value === 0) && `${this.value}`.length < minLength) {
      this.setNewError({
        ...VALIDATION_ERRORS.minLength({ field: this.field, minLength }),
      });
    }
    return this;
  }

  /**
   * Validation: Maximum length
   */
  public maxLength(maxLength: number): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if ((this.value || this.value === 0) && `${this.value}`.length > maxLength) {
      this.setNewError({
        ...VALIDATION_ERRORS.maxLength({ field: this.field, maxLength }),
      });
    }
    return this;
  }

  /**
   * Validation: Check if numbers are in a given interval
   */
  public number(minValue: number, maxValue: number): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (this.value && this.value < minValue) {
      this.setNewError({
        ...VALIDATION_ERRORS.minValue({ field: this.field, minValue }),
      });
    } else if (this.value && this.value > maxValue) {
      this.setNewError({
        ...VALIDATION_ERRORS.maxValue({ field: this.field, maxValue }),
      });
    }
    return this;
  }

  /**
   * Validation: Validation lengths with a specified list of values
   * @returns {this}
   */
  public predefinedListOfLength(listOfLengths = {}): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (!Array.isArray(listOfLengths) || listOfLengths.length === 0) {
      return this;
    }
    if (this.value && !listOfLengths.includes(this.value.length)) {
      this.setNewError({
        ...VALIDATION_ERRORS.predefinedListOfLength({ field: this.field, listOfLengths }),
      });
    }
    return this;
  }

  /**
   * Validation: Correct Phone number
   */
  public phone(length?: number): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    let isErrorDetected;
    if (this.value.startsWith('+')) {
      this.value = this.value.toString().slice(1, this.value.length);
    }
    if (this.value && !/^\d+$/.test(this.value || '')) {
      isErrorDetected = true;
      this.setNewError({
        ...VALIDATION_ERRORS.invalidPhoneFormat({ field: this.field, errorMessage: 'Invalid phone number' }),
      });
    }
    if (!isErrorDetected && length && this.value.length < length) {
      this.setNewError({
        ...VALIDATION_ERRORS.invalidPhoneFormat({
          field: this.field,
          errorMessage: 'Not enough characters in the phone number',
        }),
      });
    }
    if (!isErrorDetected && length && this.value.length > length) {
      this.setNewError({
        ...VALIDATION_ERRORS.invalidPhoneFormat({
          field: this.field,
          errorMessage: 'Too many characters in the phone number',
        }),
      });
    }
    return this;
  }

  /**
   * Validation: Minimum number of entries in an array
   */
  public arrayMinLength(minLength: number): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (Array.isArray(this.value) && this.value.length < minLength) {
      this.setNewError({
        ...VALIDATION_ERRORS.arrayMinLength({ field: this.field, minLength }),
      });
    }
    return this;
  }

  /**
   * Validation: Maximum number of entries in an array
   */
  public arrayMaxLength(maxLength: number): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (Array.isArray(this.value) && this.value.length > maxLength) {
      this.setNewError({
        ...VALIDATION_ERRORS.arrayMaxLength({ field: this.field, maxLength }),
      });
    }
    return this;
  }

  public specificArrayValues(specificArrayValues: Array<any>): this {
    if (this.error || this.shouldReturnEmptyError) {
      return this;
    }
    if (!Array.isArray(this.value) || !specificArrayValues || !specificArrayValues.length) {
      return this;
    }
    let invalidElement: any;
    const result = this.value.some((item) => {
      invalidElement = item;
      return !specificArrayValues.includes(item);
    });
    if (result) {
      this.setNewError(
        VALIDATION_ERRORS.invalidArrayElementValue({ field: this.field, value: invalidElement }),
      );
    }
    return this;
  }
}
