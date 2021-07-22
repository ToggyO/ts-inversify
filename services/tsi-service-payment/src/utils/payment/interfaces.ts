/**
 * Description: Interfaces for payment api.
 */

import {
  PaymentDTO,
  CreateSinglePaymentDTO,
  CreateCustomerDTO,
  CustomerTokenDTO,
  CreateCustomerPaymentDTO,
  PaymentCardDTO,
  AddCardToCustomerDTO,
  CustomerDTO,
} from './types';

export interface IPaymentApi {
  getCustomer(id: string): Promise<CustomerDTO | null>;
  createCustomer(dto: CreateCustomerDTO): Promise<CustomerTokenDTO>;
  createSinglePayment(dto: CreateSinglePaymentDTO): Promise<PaymentDTO>;
  createCustomerPayment(dto: CreateCustomerPaymentDTO): Promise<PaymentDTO>;
  getCustomerCards(stripeCustomerToken: string): Promise<Array<PaymentCardDTO>>;
  getCardInfo(cardId: string): Promise<PaymentCardDTO>;
  addCardToCustomer(dto: AddCardToCustomerDTO): Promise<PaymentCardDTO>;
  removeCardFromCustomer(cardId: string): Promise<string>;
}
