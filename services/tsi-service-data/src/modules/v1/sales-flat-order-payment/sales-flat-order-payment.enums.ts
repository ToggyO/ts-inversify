/**
 * Description: Sales flat order payment module enums
 */

export enum PaymentStatus {
  Succeeded = 'succeeded',
  Processing = 'processing',
  RequiresCapture = 'requires_capture',
  Failed = 'payment_failed',
}
