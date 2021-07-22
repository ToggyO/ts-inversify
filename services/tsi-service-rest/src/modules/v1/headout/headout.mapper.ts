/**
 * Description: Headout API module data mapper
 */

import { ExtendedBookingDTO, ExtendedBookingMeta, ExtendedBookingMetaDTO } from 'utils/headout';

import { PaymentDTO } from '../payment';
import { OrderPaymentDTO } from '../product';

export class HeadoutMapper {
  /**
   * Transform an array of type `ExtendedBookingDTO` to type of `ExtendedBookingMetaDTO`
   */
  public static mapToExtendedBookingMeta(bookings: Array<ExtendedBookingDTO>): ExtendedBookingMetaDTO {
    let totalPrice = 0;
    const meta: Array<ExtendedBookingMeta> = bookings.reduce((acc, booking) => {
      if (!booking) {
        return acc;
      }
      totalPrice += parseInt(booking.price.amount);
      acc.push({
        orderItemId: booking.orderItemId,
        bookingId: booking.bookingId,
        partnerReferenceId: booking.partnerReferenceId,
        status: booking.status,
      });
      return acc;
    }, [] as Array<ExtendedBookingMeta>);

    return {
      amount: totalPrice,
      bookingMeta: meta,
    };
  }

  /**
   * Transform data of type `OrderPaymentDTO` to type of `PaymentDTO`
   */
  public static mapToPaymentDTO(dto: OrderPaymentDTO): PaymentDTO | undefined {
    if (!dto) {
      return;
    }
    let parsedPaymentData;
    try {
      parsedPaymentData = JSON.parse(dto.reason);
    } catch {
      parsedPaymentData = { userEmail: '', userPhone: '' };
    }
    return {
      referenceId: dto.referenceId,
      reason: dto.reason,
      totalPaid: dto.totalPaid,
      userEmail: parsedPaymentData.userEmail,
      userPhone: parsedPaymentData.userPhone,
      status: dto.status,
    };
  }
}
