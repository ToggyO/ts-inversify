/**
 * Description: Interfaces for Headout API module
 */

import { BookingDTO, CreateBookingDTO, HeadoutVariant, UpdateBookingDTO } from './types';

export interface IHeadoutApi {
  getVariants(variantId: number, startDateTime: string, endDateTime: string): Promise<Array<HeadoutVariant>>;
  getBookingById(bookingId: string): Promise<BookingDTO | null>;
  createBooking(dto: CreateBookingDTO): Promise<BookingDTO>;
  updateBooking(dto: UpdateBookingDTO): Promise<BookingDTO>;
}
