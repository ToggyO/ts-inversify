/**
 * Description: Interfaces for sales flat order payment module
 */

import { NextFunction, Request, Response } from 'express';

import { CreateOptions, FindOptions, UpdateOptions } from 'sequelize';

import {
  GetEntityPayload,
  GetEntityResponse,
  GetListResponse,
  GetParameters,
  RequestQueries,
} from 'modules/interfaces';

import { SalesFlatOrderPaymentModel } from './sales-flat-order-payment.model';
import {
  CreateOrderPaymentDTO,
  CreateOrderPaymentPayload,
  TransactionDataDTO,
  UpdateOrderPaymentDTO,
} from './types';

export interface ISalesFlatOrderPaymentHandler {
  getOrderPayments(req: Request, res: Response, next: NextFunction): Promise<void>;
  getOrderPaymentById(req: Request, res: Response, next: NextFunction): Promise<void>;
  createOrderPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface ISalesFlatOrderPaymentEntityService {
  getEntityResponse(payload: GetEntityPayload): Promise<GetEntityResponse<SalesFlatOrderPaymentModel>>;
  getOrderPayments(query: RequestQueries): Promise<GetListResponse<SalesFlatOrderPaymentModel>>;
  createPaymentData(dto: CreateOrderPaymentPayload): Promise<TransactionDataDTO>;
}

export interface ISalesFlatOrderPaymentRepository {
  getOrderPayments(payload: GetParameters): Promise<GetListResponse<SalesFlatOrderPaymentModel>>;
  getOrderPayment(payload: FindOptions): Promise<SalesFlatOrderPaymentModel | null>;
  createOrderPayment(
    payload: CreateOrderPaymentDTO,
    options?: CreateOptions<SalesFlatOrderPaymentModel>,
  ): Promise<SalesFlatOrderPaymentModel>;
  updateOrderItem(
    payload: Partial<UpdateOrderPaymentDTO>,
    options: UpdateOptions<SalesFlatOrderPaymentModel>,
  ): Promise<[number, SalesFlatOrderPaymentModel[]]>;
}
