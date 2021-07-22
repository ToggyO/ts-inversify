/**
 * Description: Types for sales flat orders module
 */

import { ORDER_STATUSES } from 'constants/order-statuses';
import { CustomersIds } from 'modules/v1/user';

import { SalesFlatOrderModel } from './sales-flat-order.model';
import { BookingStatuses } from './sales-flat-order.enums';
import { AgeGroupOptions } from '../itinerary';

export type SalesFlatOrderModelType = typeof SalesFlatOrderModel;

export type CreateOrderPayload = {
  userId?: number;
  guestId?: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  promoCode?: string;
};

export type CreateOrderDTO = {
  userId?: number;
  guestId?: number;
  itineraryId: number;
  orderUuid?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  status:
    | typeof ORDER_STATUSES.INITIATED
    | typeof ORDER_STATUSES.PROCESSING
    | typeof ORDER_STATUSES.PENDING
    | typeof ORDER_STATUSES.CONFIRMED
    | typeof ORDER_STATUSES.FAILED;
  subTotal: number;
  netTotal: number;
  grandTotal: number;
  taxAmount: number;
  gatewayCharges: number;
  commissionCharges: number;
  discountAmount: number;
  couponCode?: string;
  referalPointId?: number;
  referralPoints?: number;
  referralDiscount?: number;
};

export type BookOrderItemsUpdateOrderPayload = {
  orderId: number;
  orderUuid: string;
  orderStatus:
    | typeof ORDER_STATUSES.INITIATED
    | typeof ORDER_STATUSES.PROCESSING
    | typeof ORDER_STATUSES.PENDING
    | typeof ORDER_STATUSES.CONFIRMED
    | typeof ORDER_STATUSES.FAILED;
  orderItems: Array<ExtendedBookingMeta>;
  promoCode?: string;
  customerIds: CustomersIds;
};

export type UpdateOrderDTO = Partial<CreateOrderDTO>;

export type OrderDetailsDTO = {
  subTotal: number;
  netTotal: number;
  grandTotal: number;
  taxAmount: number;
  gatewayCharges: number;
  commissionCharges: number;
  discountAmount: number;
  referralDiscount: number;
};

export type BookingMeta = {
  bookingId: string;
  partnerReferenceId: string | null;
  status: BookingStatuses;
};

export type ExtendedBookingMeta = BookingMeta & {
  orderItemId: number;
};

export type BookingOfUserModel = {
  id: number;
  order_id: number;
  product_id: number;
  headout_product_id: number;
  product_name: string;
  headout_variant_id: number;
  variant_name: string;
  headout_variant_item_id: number;
  product_options: string;
  is_booked: number;
  booking_id: string;
  created_at: string;
  updated_at: string;
  inputFields_id: string;
  inputFields_level: string;
};

export type BookingOfUserDTO = BookingOfUserModel & {
  product_options: Array<AgeGroupOptions>;
};

export type BaseTickets = {
  name: string;
  time: string;
  date: string;
  ticketsCount: number;
};

export type RawTickets = BaseTickets & {
  productOptions: string;
};

export type RawTicketsDTO = {
  order: SalesFlatOrderModel;
  items: Array<RawTickets>;
};

export type Tickets = BaseTickets & {
  productOptions: Array<AgeGroupOptions>;
};

export type TicketsDTO = {
  order: {
    orderUuid: string;
    subTotal: number;
    grandTotal: number;
    gatewayCharges: number;
  };
  items: Array<Tickets>;
};
