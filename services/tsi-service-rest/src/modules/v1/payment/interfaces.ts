/**
 * Description: Interfaces for payment module
 */

import { NextFunction, Request, Response } from 'express';

export interface IPaymentHandler {
  stripeCreateSinglePayment(req: Request, res: Response, next: NextFunction): Promise<void>;
  stripeCreateCustomerPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
  stripeGetCustomerCards(req: Request, res: Response, next: NextFunction): Promise<void>;
  stripeGetCardInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
  stripeAddCardToCustomer(req: Request, res: Response, next: NextFunction): Promise<void>;
  stripeRemoveCardFromCustomer(req: Request, res: Response, next: NextFunction): Promise<void>;
}
