/**
 * Description: Sales flat order payment module controller for handling routing
 */

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { GetListResponse, RequestQueries } from 'modules/interfaces';
import { getProp, autobind } from 'utils/helpers';
import { ApplicationError, getSuccessRes } from 'utils/response';

import { ISalesFlatOrderPaymentEntityService, ISalesFlatOrderPaymentHandler } from './interfaces';
import { CreateOrderPaymentPayload, TransactionDataDTO } from './types';
import { SalesFlatOrderPaymentModel } from './sales-flat-order-payment.model';
import { SFOP_MESSAGE_ERRORS } from './constants';

@injectable()
export class SalesFlatOrderPaymentController extends BaseController implements ISalesFlatOrderPaymentHandler {
  constructor(
    @inject(TYPES.ISalesFlatOrderPaymentEntityService)
    protected readonly orderPaymentsService: ISalesFlatOrderPaymentEntityService,
  ) {
    super();
    autobind(this);
  }

  /**
   * Get list of order payments
   */
  public async getOrderPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = getProp<RequestQueries>(req, 'query', {});

      const resultData = await this.orderPaymentsService.getOrderPayments(query);

      res.status(200).send(
        getSuccessRes<GetListResponse<SalesFlatOrderPaymentModel>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order payment by id
   */
  public async getOrderPaymentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);

      if (!id) {
        throw new ApplicationError(this.notFoundErrorPayload(SFOP_MESSAGE_ERRORS.NOT_FOUND));
      }

      const resultData = await this.orderPaymentsService.getEntityResponse({ id });

      if (!resultData) {
        throw new ApplicationError(this.notFoundErrorPayload(SFOP_MESSAGE_ERRORS.NOT_FOUND));
      }

      res.status(200).send(
        getSuccessRes<SalesFlatOrderPaymentModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create order payment data
   */
  public async createOrderPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<CreateOrderPaymentPayload>(req, 'body', {});

      const resultData = await this.orderPaymentsService.createPaymentData(body);

      res.status(201).send(
        getSuccessRes<TransactionDataDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
