/**
 * Description: Products module constants
 */

export const PRODUCT_ERROR_MESSAGES = {
  NOT_FOUND: (entityName: string) => `${entityName} with this identifier doesn't exist`,
} as const;
