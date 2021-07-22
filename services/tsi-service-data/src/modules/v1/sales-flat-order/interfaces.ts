/**
 * Description: Interfaces for sales flat orders module
 */

import { Request, Response, NextFunction } from 'express';
import { FindOptions, CreateOptions, UpdateOptions } from 'sequelize';

import { SalesFlatOrderModel } from './sales-flat-order.model';
import {
  GetParameters,
  GetListResponse,
  GetEntityPayload,
  GetEntityResponse,
  RequestQueries,
} from 'modules/interfaces';
import {
  BookingOfUserModel,
  CreateOrderDTO,
  CreateOrderPayload,
  RawTicketsDTO,
  TicketsDTO,
  UpdateOrderDTO,
  BookOrderItemsUpdateOrderPayload,
} from './types';

export interface ISalesFlatOrderHandler {
  getOrders(req: Request, res: Response, next: NextFunction): Promise<void>;
  getBookingsByUserId(req: Request, res: Response, next: NextFunction): Promise<void>;
  getOrderById(req: Request, res: Response, next: NextFunction): Promise<void>;
  createSalesFlatOrderWithItems(req: Request, res: Response, next: NextFunction): Promise<void>;
  bookOrderItemsAndUpdateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTickets(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface ISalesFlatOrderEntityService {
  getEntityResponse(payload: GetEntityPayload): Promise<GetEntityResponse<SalesFlatOrderModel>>;
  getOrders(query: RequestQueries): Promise<GetListResponse<SalesFlatOrderModel>>;
  getOrderById(id: number, query: RequestQueries): Promise<GetEntityResponse<SalesFlatOrderModel>>;
  getBookingsByUserId(userId: number, query: RequestQueries): Promise<GetListResponse<BookingOfUserModel>>;
  getTickets(orderId: number): Promise<TicketsDTO>;
  createSalesFlatOrderWithItems(dto: CreateOrderPayload): Promise<number>;
  bookOrderItemsAndUpdateOrderStatus(dto: BookOrderItemsUpdateOrderPayload): Promise<number>;
}

export interface ISalesFlatOrderRepository {
  getOrders(payload: GetParameters): Promise<GetListResponse<SalesFlatOrderModel>>;
  getOrder(payload: FindOptions): Promise<SalesFlatOrderModel | null>;
  getBookingsByUserId(
    userId: number,
    params: GetParameters & { onlyActiveBookings?: boolean },
  ): Promise<GetListResponse<BookingOfUserModel>>;
  getTickets(orderId: number): Promise<RawTicketsDTO>;
  createOrder(
    payload: CreateOrderDTO,
    options?: CreateOptions<SalesFlatOrderModel>,
  ): Promise<SalesFlatOrderModel>;
  updateOrder(
    payload: Partial<UpdateOrderDTO>,
    options: UpdateOptions<SalesFlatOrderModel>,
  ): Promise<[number, SalesFlatOrderModel[]]>;
}
