/**
 * Description: Types and interfaces for Validator class
 */

export type ValidatorConstructorParameters = {
  value: any;
  field: string;
  shouldTrimValue?: boolean;
  additionalParams?: Record<string, any>;
};

export type ValidatorError = {
  field?: any;
  fields?: any[];
  errorCode: string | number;
  errorMessage: string | number;
};

export type ArrayItemsType<T = any> = 'string' | 'number' | 'boolean' | 'object' | 'array' | T;

export type DateFormatValidation = {
  minDate?: string;
  maxDate?: string;
  expectedFormat?: string;
};
