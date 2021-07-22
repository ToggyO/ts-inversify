/**
 * Description: Enums for payment module
 */

export enum PaymentStatuses {
  Succeeded = 'succeeded',
  Processing = 'processing',
  RequiresCapture = 'requires_capture',
  Failed = 'payment_failed',
}
