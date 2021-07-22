/**
 * Description: Enums for payment api.
 */

export enum PaymentTypes {
  Alipay = 'alipay',
  AuBecsDebit = 'au_becs_debit',
  BacsDebit = 'bacs_debit',
  Bancontact = 'bancontact',
  Card = 'card',
  CardPresent = 'card_present',
  Eps = 'eps',
  Fpx = 'fpx',
  Giropay = 'giropay',
  Grabpay = 'grabpay',
  Ideal = 'ideal',
  Oxxo = 'oxxo',
  p24 = 'p24',
  SepaDebit = 'sepa_debit',
  Sofort = 'sofort',
}

export enum CardBrands {
  Amex = `amex`,
  Diners = `diners`,
  Discover = `discover`,
  Jcb = `jcb`,
  MasterCard = `mastercard`,
  Unionpay = `unionpay`,
  Visa = `visa`,
  Unknown = `unknown`,
}
