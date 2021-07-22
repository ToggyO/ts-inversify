/**
 * Description: Interfaces for stripe payment module
 */

import { Request, Response, NextFunction } from 'express';

import {
  PaymentDTO,
  CreateSinglePaymentDTO,
  CreateCustomerDTO,
  CustomerTokenDTO,
  CreateCustomerPaymentDTO,
  PaymentCardDTO,
  AddCardToCustomerDTO,
} from 'utils/payment';

export interface IStripeHandler {
  createSinglePayment(req: Request, res: Response, next: NextFunction): Promise<void>;
  createCustomer(req: Request, res: Response, next: NextFunction): Promise<void>;
  createCustomerPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCustomerCards(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCardInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
  addCardToCustomer(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeCardFromCustomer(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IStripeService {
  createSinglePayment(dto: CreateSinglePaymentDTO): Promise<PaymentDTO>;
  createCustomer(dto: CreateCustomerDTO): Promise<CustomerTokenDTO>;
  createCustomerPayment(dto: CreateCustomerPaymentDTO): Promise<PaymentDTO>;
  getCustomerCards(stripeCustomerToken: string): Promise<Array<PaymentCardDTO>>;
  getCardInfo(cardId: string): Promise<PaymentCardDTO>;
  addCardToCustomer(dto: AddCardToCustomerDTO): Promise<PaymentCardDTO>;
  removeCardFromCustomer(cardId: string): Promise<string>;
}
