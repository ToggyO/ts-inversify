/**
 * Description: Types for payment module
 */

export type CreatePaymentBase = {
  description: string;
  amount: number;
  currency: string;
  email: string;
};

export type CreateSinglePaymentDTO = CreatePaymentBase & {
  cardToken: string;
};

export type PaymentDTO = {
  referenceId: string;
  reason?: string; // Full json response from stripe
  totalPaid: number;
  userEmail: string | null;
  userPhone: string | null;
  status: string;
};

export type CreateCustomerDTO = {
  email: string;
  firstName: string;
  lastName: string;
};

export type CustomerDTO = {
  stripeCustomerToken: string;
};

export type AddCardToCustomerDTO = {
  stripeCustomerToken: string;
  cardId: string;
};

export type CreateCustomerPaymentDTO = CreatePaymentBase & AddCardToCustomerDTO;

export type PaymentCardDTO = {
  id: string;
  type: string;
  brand?: string;
  last4digits?: string;
  expMonth?: number;
  expYear?: number;
  country?: string | null;
  customer: string | null;
};
