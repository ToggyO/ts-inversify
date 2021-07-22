/**
 * Description: Headout API helper
 */

import { AxiosInstance, AxiosResponse } from 'axios';
import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { ERROR_CODES } from 'constants/error-codes';
import { ApplicationError } from 'utils/response';
import { autobind } from 'utils/helpers';
import { ILogger } from 'utils/logger';

import { IHeadoutApi } from './interfaces';
import {
  BookingDTO,
  CreateBookingDTO,
  HeadoutSettings,
  HeadoutVariant,
  HeadoutVariantsDTO,
  UpdateBookingDTO,
} from './types';
import { HEADOUT_MESSAGES } from './constants';
//
// import testDto from './DTO.json';
// // FIXME: delete
// console.log(testDto);

const { HEADOUT, getHeadoutUrl } = SERVICE_ENDPOINTS;

@injectable()
export class HeadoutApi implements IHeadoutApi {
  protected readonly HEADOUT_URL: string;
  protected readonly HEADOUT_KEY: string;
  protected readonly HEADOUT_AUTH_HEADER: string;

  constructor(
    @inject(TYPES.IConfiguration) protected readonly configService: IConfiguration,
    @inject(TYPES.IAxiosInstance) protected readonly axios: AxiosInstance,
    @inject(TYPES.ILogger) protected readonly _logger: ILogger,
  ) {
    autobind(this);
    const { url, key, authHeader } = this.onModuleInit();

    this.HEADOUT_URL = url;
    this.HEADOUT_KEY = key;
    this.HEADOUT_AUTH_HEADER = authHeader;
  }

  private onModuleInit(): HeadoutSettings {
    const HEADOUT_CURRENT_URL = this.configService.get<string>('HEADOUT_CURRENT_URL');
    const HEADOUT_CURRENT_KEY = this.configService.get<string>('HEADOUT_CURRENT_KEY');
    const HEADOUT_AUTH_HEADER = this.configService.get<string>('HEADOUT_AUTH_HEADER');

    if (!HEADOUT_CURRENT_URL || !HEADOUT_CURRENT_KEY || !HEADOUT_AUTH_HEADER) {
      throw new Error(`Headout API credentials are required: url, auth header, auth key`);
    }

    return {
      url: HEADOUT_CURRENT_URL,
      key: HEADOUT_CURRENT_KEY,
      authHeader: HEADOUT_AUTH_HEADER,
    };
  }

  private throwHeadoutError(): void {
    throw new ApplicationError({
      statusCode: 500,
      errorCode: ERROR_CODES.internal_server_error,
      errorMessage: HEADOUT_MESSAGES.ERROR,
      errors: [],
    });
  }

  /**
   * Get list of variants by variant id from headout, start date, end date from Headout API
   */
  public async getVariants(
    variantId: number,
    startDateTime: string,
    endDateTime: string,
  ): Promise<Array<HeadoutVariant>> {
    console.log('variantId: ', variantId);
    console.log(startDateTime);
    console.log(endDateTime);
    console.log(
      'getVariants',
      getHeadoutUrl(HEADOUT.GET_VARIANTS(variantId, startDateTime, endDateTime, { limit: 100 })),
    );
    const response: AxiosResponse<HeadoutVariantsDTO> = await this.axios.get(
      getHeadoutUrl(HEADOUT.GET_VARIANTS(variantId, startDateTime, endDateTime, { limit: 100 })),
      {
        headers: {
          [this.HEADOUT_AUTH_HEADER]: this.HEADOUT_KEY,
        },
      },
    );

    if (response.status !== 200) {
      console.log(this.HEADOUT_KEY);
      console.log(response.status);
      // FIXME: delete
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { error } = response.data;
      this._logger.error(`Get variants: ${JSON.stringify(error)}`);
      this._logger.error(
        `Get variants params: ${JSON.stringify({
          variantId,
          startDateTime,
          endDateTime,
        })}`,
      );
      this.throwHeadoutError();
    }
    console.log(this.HEADOUT_KEY);
    console.log(response.status);
    return response.data.items;
  }

  /**
   * Get booking by `bookingId` from Headout API
   */
  public async getBookingById(bookingId: string): Promise<BookingDTO | null> {
    console.log('getBookingById', getHeadoutUrl(HEADOUT.GET_BOOKING_BY_ID(bookingId)));
    if (!bookingId) {
      return null;
    }
    const response: AxiosResponse<BookingDTO> = await this.axios.get(
      getHeadoutUrl(HEADOUT.GET_BOOKING_BY_ID(bookingId)),
      {
        headers: {
          [this.HEADOUT_AUTH_HEADER]: this.HEADOUT_KEY,
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status !== 200) {
      // FIXME: delete
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { error } = response.data;
      this._logger.error(`Get booking: ${JSON.stringify(error)}`);
      this.throwHeadoutError();
    }

    return response.data;
  }

  /**
   * Create booking with status `UNCAPTURED` on Headout API
   */
  public async createBooking(dto: CreateBookingDTO): Promise<BookingDTO> {
    // FIXME: delete
    console.log('createBooking', getHeadoutUrl(HEADOUT.CREATE_BOOKING));
    // console.log(testDto);
    // dto = testDto as CreateBookingDTO;
    console.log(dto);
    console.log(dto.customersDetails.customers);
    console.log(dto.customersDetails.customers[0].inputFields);
    const response: AxiosResponse<BookingDTO> = await this.axios.post(
      getHeadoutUrl(HEADOUT.CREATE_BOOKING),
      dto,
      {
        headers: {
          [this.HEADOUT_AUTH_HEADER]: this.HEADOUT_KEY,
          'Accept-Encoding': 'gzip',
        },
      },
    );

    if (response.status !== 200) {
      // FIXME: delete
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { error } = response.data;
      console.log('code:', error?.code);
      console.log('title:', error?.title);
      console.log('message:', error?.message);
      this._logger.error(`Create booking: ${JSON.stringify(error)}`);
      this.throwHeadoutError();
    }
    this._logger.info(`Booking number ${response.data.bookingId} created at ${new Date().toISOString()}`);
    return response.data;
  }

  /**
   * Update booking with status on Headout API
   */
  public async updateBooking(dto: UpdateBookingDTO): Promise<BookingDTO> {
    const { bookingId, ...rest } = dto;
    // FIXME: delete
    console.log('updateBooking', getHeadoutUrl(HEADOUT.MODIFY_BOOKING(bookingId)));
    const response: AxiosResponse = await this.axios.put(
      getHeadoutUrl(HEADOUT.MODIFY_BOOKING(bookingId)),
      rest,
      {
        headers: {
          [this.HEADOUT_AUTH_HEADER]: this.HEADOUT_KEY,
        },
      },
    );

    if (response.status !== 200) {
      // FIXME: delete
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { error } = response.data;
      console.log('code:', error?.code);
      console.log('title:', error?.title);
      console.log('message:', error?.message);
      this._logger.error(`Update booking: ${JSON.stringify(error)}`);
      this.throwHeadoutError();
    }
    this._logger.info(`Booking number ${bookingId} accepted at ${new Date().toISOString()}`);
    return response.data;
  }
}
