/**
 * Description: Types for payment api.
 */

import Stripe from 'stripe';
import { CardBrands } from './enums';

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
  reason: string; // Full json response from stripe
  totalPaid: number;
  userEmail: string | null;
  userPhone?: string | null;
  status: string;
};

export type CreateCustomerDTO = {
  email: string;
  firstName: string;
  lastName: string;
};

export type CustomerDTO = {
  id: string;
  balance: number;
  currency: string | null;
  description: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
};

export type CustomerTokenDTO = {
  stripeCustomerToken: string;
};

export type PaymentCardDTO = {
  id: string;
  type: Stripe.PaymentMethod.Type;
  brand?: string | CardBrands;
  last4digits?: string;
  expMonth?: number;
  expYear?: number;
  country?: string | null;
  customer: string | Stripe.Customer | null;
};

export type AddCardToCustomerDTO = {
  stripeCustomerToken: string;
  cardId: string;
};

export type CreateCustomerPaymentDTO = CreatePaymentBase & AddCardToCustomerDTO;
