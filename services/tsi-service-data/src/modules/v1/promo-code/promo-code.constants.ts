/**
 * Description: Promo code module constants
 */

export const PROMO_ERROR_MESSAGES = {
  NOT_FOUND: 'Promo code not found',
  ALREADY_USED: 'Promo code have already used by user.',
  INVALID: 'Promo code is invalid',
  UNAVAILABLE: 'Promo code is unavailable',
  UNAVAILABLE_DAY_OF_THE_WEEK: 'Not available day of the week for provided promo code',
  MIN_CART_AMOUNT: (minAmount: number) =>
    `Minimum cart price amount is not reached. Must be greater then ${minAmount}`,
  INVALID_USAGE_DATE: 'Current date is not included in a range of available dates',
};
