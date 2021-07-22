/**
 * Description: Interfaces for Headout API service
 */

import { BookingMeta, ExtendedBookingMetaDTO } from 'utils/headout';
import { OrderItemDTO, PurchaseProductUserDTO } from 'modules/v1/product';

import { BookingIdsDTO, HeadoutVariantAvailabilityDTO } from './types';

export interface IHeadoutService {
  getVariants(
    headoutVariantId: number,
    startDateTime: string,
    endDateTime: string,
  ): Promise<HeadoutVariantAvailabilityDTO>;
  getBookingsMeta(bookingIds: Array<BookingIdsDTO>): Promise<ExtendedBookingMetaDTO>;
  createBooking(
    orderItems: Array<OrderItemDTO>,
    user: PurchaseProductUserDTO,
  ): Promise<ExtendedBookingMetaDTO>;
  updateBooking(bookings: Array<BookingMeta>, orderId: string): Promise<Array<BookingMeta>>;
}
