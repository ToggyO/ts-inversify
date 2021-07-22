/**
 * Description: Payment module controller for handling payment routing
 */

import { Request, Response, NextFunction } from 'express';
import { AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { getSuccessRes, Success } from 'utils/response';
import { autobind, getProp } from 'utils/helpers';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';

import { IPaymentHandler } from './interfaces';
import {
  AddCardToCustomerDTO,
  CreateCustomerPaymentDTO,
  CreateSinglePaymentDTO,
  PaymentCardDTO,
  PaymentDTO,
} from './types';

const { PAYMENT, getPaymentServiceUrl } = SERVICE_ENDPOINTS;

@injectable()
export class PaymentController extends BaseController implements IPaymentHandler {
  constructor() {
    super();
    autobind(this);
  }

  /**
   * Stripe: create single payment of unauthorized user
   */
  public async stripeCreateSinglePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<CreateSinglePaymentDTO>(req, 'body', {});

      const response: AxiosResponse<Success<PaymentDTO>> = await this.axios.post(
        getPaymentServiceUrl(PAYMENT.STRIPE.SINGLE_PAYMENT),
        body,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { resultData } = response.data;
      delete resultData.reason;

      res.status(200).send(
        getSuccessRes<PaymentDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Stripe: create customer payment of authorized user
   */
  public async stripeCreateCustomerPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<CreateCustomerPaymentDTO>(req, 'body', {});

      const response: AxiosResponse<Success<PaymentDTO>> = await this.axios.post(
        getPaymentServiceUrl(PAYMENT.STRIPE.CUSTOMER_PAYMENT),
        body,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { resultData } = response.data;
      delete resultData.reason;

      res.status(200).send(
        getSuccessRes<PaymentDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Stripe: get payment cards of authorized user
   */
  public async stripeGetCustomerCards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stripeCustomerToken = getProp<string>(req, 'body.stripeCustomerToken', null);

      const response: AxiosResponse<Success<Array<PaymentCardDTO>>> = await this.axios.post(
        getPaymentServiceUrl(PAYMENT.STRIPE.CUSTOMER_GET_CARDS),
        {
          stripeCustomerToken,
        },
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;

      res.status(200).send(
        getSuccessRes<Array<PaymentCardDTO>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Stripe: get payment card info by card id of authorized user
   */
  public async stripeGetCardInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cardId = getProp<string>(req, 'body.cardId', null);

      const response: AxiosResponse<Success<PaymentCardDTO>> = await this.axios.post(
        getPaymentServiceUrl(PAYMENT.STRIPE.CUSTOMER_GET_CARD_INFO),
        { cardId },
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;

      res.status(200).send(
        getSuccessRes<PaymentCardDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Stripe: attach payment card to authorized user
   */
  public async stripeAddCardToCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<AddCardToCustomerDTO>(req, 'body', {});

      const response: AxiosResponse<Success<PaymentCardDTO>> = await this.axios.post(
        getPaymentServiceUrl(PAYMENT.STRIPE.CUSTOMER_ADD_CARD),
        body,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { resultData } = response.data;

      res.status(200).send(
        getSuccessRes<PaymentCardDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Stripe: detach payment card from customer
   */
  public async stripeRemoveCardFromCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cardId = getProp<string>(req, 'params.cardId', null);

      const response: AxiosResponse<Success<string>> = await this.axios.delete(
        getPaymentServiceUrl(PAYMENT.STRIPE.CUSTOMER_REMOVE_CARD_REQUEST(cardId)),
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { resultData } = response.data;

      res.status(200).send(
        getSuccessRes<string>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
