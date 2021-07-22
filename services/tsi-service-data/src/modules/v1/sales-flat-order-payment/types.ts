/**
 * Description: Types for sales flat order payment module
 */

import { SalesFlatOrderPaymentModel } from './sales-flat-order-payment.model';

export type SalesFlatOrderPaymentModelType = typeof SalesFlatOrderPaymentModel;

export type CreateOrderPaymentPayload = {
  orderId: number;
  referenceId: string;
  reason: string;
  totalPaid: number;
  paymentStatus: string;
};

export type CreateOrderPaymentDTO = Omit<CreateOrderPaymentPayload, 'paymentStatus'> & {
  status: number;
  transactionId: string;
};

export type TransactionDataDTO = {
  id: number;
  transactionId: string;
  status: number;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type UpdateOrderPaymentDTO = {};
