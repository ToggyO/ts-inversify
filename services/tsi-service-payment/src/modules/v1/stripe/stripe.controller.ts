/**
 * Description: Stripe payment module controller for handling stripe payment routing
 */

import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { getSuccessRes } from 'utils/response';
import { autobind, getProp } from 'utils/helpers';
import {
  PaymentDTO,
  CreateSinglePaymentDTO,
  CreateCustomerDTO,
  CustomerTokenDTO,
  CreateCustomerPaymentDTO,
  PaymentCardDTO,
  AddCardToCustomerDTO,
} from 'utils/payment';

import { IStripeHandler, IStripeService } from './interfaces';

@injectable()
export class StripeController extends BaseController implements IStripeHandler {
  constructor(@inject(TYPES.IStripeService) protected readonly stripeService: IStripeService) {
    super();
    autobind(this);
  }

  /**
   * Create stripe customer
   */
  public async createCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<CreateCustomerDTO>(req, 'body', {});

      const resultData = await this.stripeService.createCustomer(body);

      res.status(201).send(
        getSuccessRes<CustomerTokenDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create payment for unauthorized user
   */
  public async createSinglePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<CreateSinglePaymentDTO>(req, 'body', {});

      const resultData = await this.stripeService.createSinglePayment(body);

      res.status(200).send(
        getSuccessRes<PaymentDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create payment for authorized customer
   */
  public async createCustomerPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<CreateCustomerPaymentDTO>(req, 'body', {});

      const resultData = await this.stripeService.createCustomerPayment(body);

      res.status(200).send(
        getSuccessRes<PaymentDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment cards of customer
   */
  public async getCustomerCards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stripeCustomerToken = getProp<string>(req, 'body.stripeCustomerToken', null);

      const resultData = await this.stripeService.getCustomerCards(stripeCustomerToken);

      res.status(200).send(
        getSuccessRes<Array<PaymentCardDTO>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment card info
   */
  public async getCardInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cardId = getProp<string>(req, 'body.cardId', null);

      const resultData = await this.stripeService.getCardInfo(cardId);

      res.status(200).send(
        getSuccessRes<PaymentCardDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Attach payment card to customer
   */
  public async addCardToCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<AddCardToCustomerDTO>(req, 'body', {});

      const resultData = await this.stripeService.addCardToCustomer(body);

      res.status(200).send(
        getSuccessRes<PaymentCardDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Detach payment card from customer
   */
  public async removeCardFromCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cardId = getProp<string>(req, 'params.cardId', null);

      const resultData = await this.stripeService.removeCardFromCustomer(cardId);

      res.status(200).send(
        getSuccessRes<string>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
