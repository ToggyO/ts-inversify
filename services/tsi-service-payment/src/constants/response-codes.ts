/**
 * Description: Constants with possible server response codes
 */

export const POSSIBLE_CODES = {
  success: 'success',
  not_found: 'not_found',
  business_conflict: 'business_conflict',
  bad_parameters: 'bad_parameters',
  unprocessable_entity: 'unprocessable_entity',
  internal_error: 'internal_error',
  // usefull in future
  security_error: 'security_error',
  permission_error: 'permission_error',
  too_many_requests: 'too_many_requests',
  gateway_timeout: 'gateway_timeout',
  object_input_error: 'object_input_error',
};

export const SUCCESS = POSSIBLE_CODES.success;
export const NOT_FOUND = POSSIBLE_CODES.not_found;
export const BUSINESS_CONFLICT = POSSIBLE_CODES.business_conflict;
export const BAD_PARAMETERS = POSSIBLE_CODES.bad_parameters;
export const UNPROCESSABLE_ENTITY = POSSIBLE_CODES.unprocessable_entity;
export const INTERNAL_ERROR = POSSIBLE_CODES.internal_error;
// usefull in future
export const SECURITY_ERROR = POSSIBLE_CODES.security_error;
export const PERMISSION_ERROR = POSSIBLE_CODES.permission_error;
export const TOO_MANY_REQUESTS_ERROR = POSSIBLE_CODES.too_many_requests;
export const GATEWAY_TIMEOUT = POSSIBLE_CODES.gateway_timeout;
export const OBJECT_INPUT_ERROR = POSSIBLE_CODES.object_input_error;
