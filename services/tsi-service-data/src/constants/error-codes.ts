/**
 * Description: Constants with possible server response codes
 */

export enum ERROR_CODES {
  success = 0,
  //
  not_found = 1,
  // ошибки пользовательских данных
  validation = 400,
  validation__invalid_email = 4001,
  authorization__invalid_credentials_error = 'authorization__invalid_credentials_error',
  //
  notAcceptable = 406,
  conflict = 409,
  // ошибки безопасности
  security__unauthorized_error = 2001,
  security__invalid_token_error = 2020,
  security__invalid_confirm_token_error = 2030,
  security__no_permissions = 403,
  security__blocked = 4003,
  // ошибка выполнения транзакции
  transaction__error = 2409,
  // внутренние ошибки сервера
  internal_server_error = 500,
}
