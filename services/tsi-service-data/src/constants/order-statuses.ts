/**
 * Description: Constants with possible customer's orders statuses
 */

export const ORDER_STATUSES = {
  INITIATED: 'initiated',
  PROCESSING: 'processing',
  PENDING: 'pending',
  FAILED: 'failed',
  CONFIRMED: 'confirmed',
} as const;
