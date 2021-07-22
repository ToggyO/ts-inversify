/**
 * Description: Headout API service
 */

import moment from 'moment';
import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { OrderItemDTO, PurchaseProductUserDTO } from 'modules/v1/product';
import { autobind } from 'utils/helpers';
import {
  HEADOUT_MESSAGES,
  IHeadoutApi,
  InputFields,
  ExtendedBookingDTO,
  BookingMeta,
  ExtendedBookingMetaDTO,
} from 'utils/headout';
import { AgeGroupOptions } from 'modules/v1/cart';
import { BookingStatuses } from 'utils/headout/enums';

import { HeadoutMapper } from './headout.mapper';
import { IHeadoutService } from './interfaces';
import { BookingIdsDTO, HeadoutVariantAvailabilityDTO } from './types';
import { HeadoutCustomersDTO } from './dto/HeadoutCustomersDTO';

@injectable()
export class HeadoutService implements IHeadoutService {
  private readonly _ezGuideMail: string;

  constructor(
    @inject(TYPES.IConfiguration) protected readonly configService: IConfiguration,
    @inject(TYPES.IHeadoutApi) protected readonly headout: IHeadoutApi,
  ) {
    autobind(this);
    this._ezGuideMail = this.configService.get<string>('MAIL_USERNAME', '');
  }

  /**
   * Get list of variants by headout variant id, start date, end date from Headout API
   */
  public async getVariants(
    variantId: number,
    startDateTime: string,
    endDateTime: string,
  ): Promise<HeadoutVariantAvailabilityDTO> {
    /**
     * You will not be able to find your `variant` in the Headout API for the date interval taken from the database.
     * You need to expand the time range for the Headout API to return options to you.
     */
    const { startDateForHeadoutSearch, endDateForHeadoutSearch } = this._createSearchDateRange(
      startDateTime,
      endDateTime,
    );

    const items = await this.headout.getVariants(
      variantId,
      startDateForHeadoutSearch,
      endDateForHeadoutSearch,
    );

    const parsedStartDateTime = moment.utc(startDateTime).format('YYYY-MM-DDTHH:mm:ss').toString();
    const parsedEndDateTime = moment.utc(endDateTime).format('YYYY-MM-DDTHH:mm:ss').toString();
    const variant = items.filter(
      (item) => parsedStartDateTime === item.startDateTime && parsedEndDateTime === item.endDateTime,
    );

    const result = variant.length
      ? {
          available: true,
          tickets: variant[0],
        }
      : {
          available: false,
          tickets: HEADOUT_MESSAGES.TICKETS_NOT_FOUND,
        };

    return result;
  }

  /**
   * Get booking by `bookingId` from Headout API
   */
  public async getBookingsMeta(dto: Array<BookingIdsDTO>): Promise<ExtendedBookingMetaDTO> {
    const promiseArray = dto.map(async (item) => this.getExtendedBookingMeta(item));
    const bookings = await Promise.all(promiseArray);
    return HeadoutMapper.mapToExtendedBookingMeta(bookings as Array<ExtendedBookingDTO>);
  }

  /**
   * Create booking on Headout for every item in order items array
   */
  public async createBooking(
    orderItems: Array<OrderItemDTO>,
    user: PurchaseProductUserDTO,
  ): Promise<ExtendedBookingMetaDTO> {
    const bookingArray = orderItems.map(async (item) => this.bookItem(item, user));
    const bookings = await Promise.all(bookingArray);
    return HeadoutMapper.mapToExtendedBookingMeta(bookings);
  }

  /**
   * Accept booking on Headout for every item in booking item array
   */
  public async updateBooking(bookings: Array<BookingMeta>, orderId: string): Promise<Array<BookingMeta>> {
    const bookingArray = bookings.map(async (booking) =>
      this.headout.updateBooking({
        partnerReferenceId: orderId,
        bookingId: booking.bookingId,
        status: BookingStatuses.Pending,
      }),
    );
    const acceptedBookings = await Promise.all(bookingArray);
    return acceptedBookings.map((booking) => ({
      bookingId: booking.bookingId,
      partnerReferenceId: booking.partnerReferenceId,
      status: booking.status,
    }));
  }

  /**
   * Prepare order item for booking
   */
  private async bookItem(item: OrderItemDTO, user: PurchaseProductUserDTO): Promise<ExtendedBookingDTO> {
    const variantInputFields: Array<InputFields> = [
      {
        id: item.inputFieldsId,
        name: item.inputFieldsId,
        value: item.inputFieldsLevel,
      },
    ];
    let productOptions: Array<AgeGroupOptions>;
    try {
      productOptions = JSON.parse(item.productOptions);
    } catch {
      productOptions = [];
    }
    const { amount, customers } = this.getCustomersAndAmount(productOptions, user);
    const customersDetails = {
      count: productOptions.reduce((acc, option) => {
        acc += parseInt(option.orderedQty.toString());
        return acc;
      }, 0),
      customers,
    };
    const price = { amount: amount.toFixed(2), currencyCode: 'GBP' as const };
    const booking = await this.headout.createBooking({
      variantId: item.headoutVariantId,
      inventoryId: item.headoutVariantItemId,
      customersDetails,
      variantInputFields,
      price,
    });

    return {
      ...booking,
      orderItemId: item.id,
    };
  }

  /**
   * Get booking by id and transform to type of `ExtendedBookingDTO`
   */
  private async getExtendedBookingMeta(bookingDto: BookingIdsDTO): Promise<ExtendedBookingDTO | null> {
    const booking = await this.headout.getBookingById(bookingDto.bookingId);
    if (!booking) {
      return null;
    }
    return {
      ...booking,
      orderItemId: bookingDto.orderItemId,
    };
  }

  /**
   * Get customer's array and total amount of price
   */
  private getCustomersAndAmount(
    productOptions: Array<AgeGroupOptions>,
    user: PurchaseProductUserDTO,
  ): { amount: number; customers: Array<HeadoutCustomersDTO> } {
    let isPrimary = true;
    return productOptions.reduce(
      (acc, customer, index) => {
        if (customer.orderedQty > 0) {
          if (acc.customers.length > 0) {
            isPrimary = false;
          }
          acc.amount += customer.totalPrice;
          for (let i = 0; i < customer.orderedQty; i++) {
            const dto = new HeadoutCustomersDTO({
              personType: customer.name,
              // isPrimary: index <= 0 && i === 0,
              isPrimary,
              inputFields: [
                {
                  id: 'NAME',
                  name: 'Full Name',
                  value: user.userName || 'Guest easyguide',
                },
                {
                  id: 'PHONE',
                  name: 'Phone',
                  value: user.userPhone || '+447957112252',
                },
                {
                  id: 'EMAIL',
                  name: 'Email',
                  value: user.userEmail || this._ezGuideMail,
                },
              ],
            });
            acc.customers.push(dto);
          }
        }
        return acc;
      },
      { amount: 0, customers: [] as HeadoutCustomersDTO[] },
    );
  }

  /**
   * Create date range for variant searching in Headout
   */
  private _createSearchDateRange(
    startDateTime: string,
    endDateTime: string,
  ): { startDateForHeadoutSearch: string; endDateForHeadoutSearch: string } {
    const today = moment();
    const start = moment.utc(startDateTime);
    let startDateForHeadoutSearch: string;
    if (start.isSame(today, 'day')) {
      startDateForHeadoutSearch = moment.utc(startDateTime).format('YYYY-MM-DD').toString() + 'T00:00:00';
    } else {
      startDateForHeadoutSearch = moment.utc(startDateTime).format('YYYY-MM-DD').toString() + 'T00:00:00';
      // startDateForHeadoutSearch =
      //   moment.utc(startDateTime).subtract(1, 'day').format('YYYY-MM-DD').toString() + 'T00:00:00';
    }
    const endDateForHeadoutSearch = moment.utc(endDateTime).format('YYYY-MM-DD').toString() + 'T23:59:00';
    return { startDateForHeadoutSearch, endDateForHeadoutSearch };
  }
}
