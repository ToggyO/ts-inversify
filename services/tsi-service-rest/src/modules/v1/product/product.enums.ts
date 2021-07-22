/**
 * Description: Product module enums
 */

export enum OrderStatuses {
  INITIATED = 'initiated',
  PROCESSING = 'processing',
  PENDING = 'pending',
  FAILED = 'failed',
  CONFIRMED = 'confirmed',
}

export enum ProductMediaPositions {
  Web = 'web',
  Mobile = 'mobile',
}

export enum WalletTypes {
  ApplePay = 1,
  GooglePay,
}
