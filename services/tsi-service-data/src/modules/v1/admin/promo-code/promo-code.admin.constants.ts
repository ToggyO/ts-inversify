/**
 * Description: Promo code module constants
 */

export const PROMO_ERROR_MESSAGES = {
  NOT_FOUND: (entityName: string) => `${entityName} with this identifier doesn't exist`,
  EXISTS: 'Field "promo_code" must be unique',
} as const;
