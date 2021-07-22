/**
 * Description: Constants with possible validation errors
 */

import { getEnumerationValues } from 'utils/helpers';
import { ValidatorError } from 'utils/validation/types';

export const POSSIBLE_VALIDATION_CODES = {
  validation_required_field: 'valid.required_field',
  validation_is_number_field: 'valid.is_number_field',
  validation_is_string_field: 'valid.is_string_field',
  validation_is_array_field: 'valid.is_array_field',
  validation_is_all_items_of_type_field: 'valid.is_all_items_of_type_field',
  validation_is_contains_only_numbers_field: 'valid.is_contains_only_numbers',
  validation_is_boolean_field: 'valid.is_boolean_field',
  validation_conflict_fields: 'valid.conflict_fields',
  validation_min_length: 'valid.min_length',
  validation_max_length: 'valid.max_length',
  validation_min_value: 'valid.min_value',
  validation_max_value: 'valid.max_value',
  validation_invalid_email_format: 'valid.invalid_email_format',
  validation_invalid_password_format: 'valid.invalid_password_format',
  validation_invalid_enumeration: 'valid.invalid_enumeration',
  validation_invalid_phone_format: 'valid.invalid_phone_format',
  validation_invalid_date_format: 'valid.invalid_date_format',
  validation_invalid_field_format: 'valid.invalid_field_format',
  validation_unique_input_error: 'valid.unique_input_error',
  validation_reference_input_error: 'valid.reference_input_error',
  validation_array_min_length: 'valid.array_min_length',
  validation_array_max_length: 'valid.array_max_length',
  validation_array_invalid_element: 'valid.array_invalid_element',
  validation_entity_not_exists: 'valid.entity_not_exists',
  validation_data_flow_error: 'valid.data_flow_error',
  validation_file_format_error: 'valid.file_format_error',
  validation_business_logic_error: 'valid.business_logic_error',
  xlxs_validation_error: 'valid.xlxs_validation_error',
  validation_predefined_list_of_length: '',
};

type ValidationErrorsArguments = {
  [key: string]: any;
};

export type ValidationErrorsConstructor = {
  [key: string]: (obj: ValidationErrorsArguments) => ValidatorError;
};

export const VALIDATION_ERRORS: ValidationErrorsConstructor = {
  requiredField: ({ field }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_required_field,
    errorMessage: `Field "${field}" is required`,
  }),
  isNumber: ({ field }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_is_number_field,
    errorMessage: `Field "${field}" must be a number`,
  }),
  isArray: ({ field }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_is_array_field,
    errorMessage: `Field "${field}" must be an array`,
  }),
  isAllItemsOfType: ({ field, itemType }) => ({
    field,
    expectedType: itemType,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_is_all_items_of_type_field,
    errorMessage: `All array elements must be a type of ${itemType}`,
  }),
  isContainsOnlyNumbers: ({ field }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_is_contains_only_numbers_field,
    errorMessage: 'Field must contain only digits',
  }),
  isBoolean: ({ field }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_is_boolean_field,
    errorMessage: 'Field must contain a boolean variable',
  }),
  conflictFields: ({ fields }) => ({
    fields,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_conflict_fields,
    errorMessage: 'Business conflict with fields',
  }),
  minLength: ({ field, minLength }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_min_length,
    errorMessage: `Minimum count of symbols: ${minLength}`,
  }),
  maxLength: ({ field, maxLength }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_max_length,
    errorMessage: `Maximum count of symbols: ${maxLength}`,
  }),
  minValue: ({ field, minValue }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_min_value,
    errorMessage: `Minimum value: ${minValue}`,
  }),
  maxValue: ({ field, maxValue }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_max_value,
    errorMessage: `Maximum value: ${maxValue}`,
  }),
  predefinedListOfLength: ({ field, listOfLengths }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_predefined_list_of_length,
    errorMessage: `The value does not match the specified interval: ${listOfLengths}`,
  }),
  invalidEmailFormat: ({ field }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_invalid_email_format,
    errorMessage: 'Invalid email format',
  }),
  isInvalidPasswordFormat: ({ field }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_invalid_password_format,
    errorMessage:
      'Invalit password format.' +
      'Password must include at least one digit, at least one latin letter in an upper case,' +
      'at least one latin letter in a lower case and contain at least 8 characters',
  }),
  invalidEnumValue: ({ field, enumeration }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_invalid_enumeration,
    errorMessage: `Field ${field} is enumerable and must contain one of the values ${getEnumerationValues(
      enumeration,
    )}.`,
  }),
  invalidPhoneFormat: ({ field, errorMessage }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_invalid_phone_format,
    errorMessage,
  }),
  invalidDateFormat: ({ field, minDate, maxDate, expectedFormat }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_invalid_date_format,
    errorMessage: `Incorrect date format${expectedFormat ? `. Expected format is '${expectedFormat}'` : ''}${
      minDate ? `. Minimum date threshold exceeded - ${minDate}.` : ''
    }${maxDate ? `. The maximum date threshold has been exceeded - ${maxDate}.` : ''}`, // eslint-disable-line
  }),
  arrayMinLength: ({ field, minLength }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_array_min_length,
    errorMessage: `Minimum number of elements in an array: ${minLength}`,
  }),
  arrayMaxLength: ({ field, maxLength }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_array_max_length,
    errorMessage: `Maximum number of elements in an array: ${maxLength}`,
  }),
  invalidArrayElementValue: ({ field, value }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_array_invalid_element,
    errorMessage: `Invalid value of array element: ${value}`,
  }),
  // Need translation
  entityNotExistsError: ({ field }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_entity_not_exists,
    errorMessage: 'Сущность отсутствует в системе',
  }),
  dataFlowError: ({ field, message }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_data_flow_error,
    errorMessage: message || 'Логическая ошибка предоставленных данных',
  }),
  allowedFormats: ({ field, formats }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_file_format_error,
    errorMessage: `Формат файла не удовлетворяет установленным условиям (${formats.join(', ')})`,
  }),
  xlxsValidationError: ({ field, message }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.xlxs_validation_error,
    errorMessage: message || '',
  }),
  businessLogicError: ({ field, message }) => ({
    field,
    errorCode: POSSIBLE_VALIDATION_CODES.validation_business_logic_error,
    errorMessage: message || '',
  }),
};
