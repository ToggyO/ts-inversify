/**
 * Description: Stripe payment API helper
 */

import Stripe from 'stripe';
import iterate from 'iterare';
import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { autobind } from 'utils/helpers';
import { ApplicationError } from 'utils/response';
import { ERROR_CODES } from 'constants/error-codes';

import { IPaymentApi } from '../interfaces';
import { PaymentTypes } from '../enums';
import {
  PaymentDTO,
  CreateSinglePaymentDTO,
  CreateCustomerDTO,
  CustomerTokenDTO,
  CreateCustomerPaymentDTO,
  AddCardToCustomerDTO,
  PaymentCardDTO,
  CustomerDTO,
} from '../types';
import { CardDTO } from './dto/CardDTO';

@injectable()
export class StripeApi implements IPaymentApi {
  private readonly _stripeClient: Stripe;

  constructor(@inject(TYPES.IConfiguration) protected readonly configService: IConfiguration) {
    autobind(this);
    const { apiKey, apiVersion } = this.onModuleInit();
    this._stripeClient = new Stripe(apiKey, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      apiVersion: apiVersion,
      typescript: true,
    });
  }

  private onModuleInit(): { apiKey: string; apiVersion: string } {
    const STRIPE_PRIVATE_KEY = this.configService.get<string>('STRIPE_PRIVATE_KEY');
    if (!STRIPE_PRIVATE_KEY) {
      throw new Error('Provide a valid stripe api key');
    }
    const STRIPE_API_VERSION = this.configService.get<string>('STRIPE_API_VERSION', '2020-08-27');
    return { apiKey: STRIPE_PRIVATE_KEY, apiVersion: STRIPE_API_VERSION };
  }

  private throwStripeError(error: Stripe.StripeError): void {
    throw new ApplicationError({
      statusCode: error.statusCode,
      errorCode: error.type,
      errorMessage: error.message,
      errors: [],
    });
  }

  /**
   * Get stripe customer
   */
  public async getCustomer(id: string): Promise<CustomerDTO | null> {
    const { customers } = this._stripeClient;
    let customer: Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>;
    try {
      customer = await customers.retrieve(id);
      if (!customer || customer.deleted) {
        throw new ApplicationError({
          statusCode: 409,
          errorCode: 'StripeAPIError',
          errorMessage: 'Customer has been deleted',
          errors: [],
        });
      }
    } catch (error) {
      this.throwStripeError(error);
    }
    const { balance, currency, description, email, name, phone } = customer! as Stripe.Customer;
    return { id, balance, currency, description, email, name, phone };
  }

  /**
   * Create stripe customer
   */
  public async createCustomer(dto: CreateCustomerDTO): Promise<CustomerTokenDTO> {
    const { customers } = this._stripeClient;

    let result: Stripe.Response<Stripe.Customer>;
    try {
      result = await customers.create({
        email: dto.email,
        name: `${dto.firstName.charAt(0).toUpperCase() + dto.firstName.slice(1)} ${
          dto.lastName.charAt(0).toUpperCase() + dto.lastName.slice(1)
        }`,
      });
    } catch (error) {
      this.throwStripeError(error);
    }

    return { stripeCustomerToken: result!.id };
  }

  /**
   * Create payment for unauthorized user
   */
  public async createSinglePayment(dto: CreateSinglePaymentDTO): Promise<PaymentDTO> {
    const { charges } = this._stripeClient;
    const { email, cardToken, ...rest } = dto;
    let result: Stripe.Response<Stripe.Charge>;
    try {
      result = await charges.create({
        ...rest,
        receipt_email: email,
        source: cardToken,
      });
    } catch (error) {
      this.throwStripeError(error);
    }

    return {
      referenceId: result!.id,
      reason: JSON.stringify(result!),
      totalPaid: result!.amount / 100,
      userEmail: result!.receipt_email,
      userPhone: result!.receipt_number,
      status: result!.status,
    };
  }

  /**
   * Create payment for authorized customer
   */
  public async createCustomerPayment(dto: CreateCustomerPaymentDTO): Promise<PaymentDTO> {
    const { paymentIntents } = this._stripeClient;
    const { stripeCustomerToken, cardId, email, ...rest } = dto;
    let result: Stripe.Response<Stripe.PaymentIntent>;
    try {
      result = await paymentIntents.create({
        ...rest,
        receipt_email: email,
        customer: stripeCustomerToken,
        payment_method: cardId,
        payment_method_types: [PaymentTypes.Card],
        confirm: true,
      });
    } catch (error) {
      this.throwStripeError(error);
    }

    return {
      referenceId: result!.id,
      reason: JSON.stringify(result!),
      totalPaid: result!.amount / 100,
      userEmail: result!.receipt_email,
      status: result!.status,
    };
  }

  /**
   * Get payment cards of customer
   */
  public async getCustomerCards(stripeCustomerToken: string): Promise<Array<PaymentCardDTO>> {
    const { paymentMethods } = this._stripeClient;
    let result: Array<PaymentCardDTO> = [];
    try {
      const list = await paymentMethods.list({
        type: PaymentTypes.Card,
        customer: stripeCustomerToken,
      });
      result = iterate(list.data)
        .map((card: Stripe.PaymentMethod) => new CardDTO(card))
        .toArray();
    } catch (error) {
      this.throwStripeError(error);
    }

    return result;
  }

  /**
   * Get payment card info
   */
  public async getCardInfo(cardId: string): Promise<PaymentCardDTO> {
    const { paymentMethods } = this._stripeClient;
    let result: Stripe.Response<Stripe.PaymentMethod>;
    try {
      result = await paymentMethods.retrieve(cardId);
    } catch (error) {
      result = {} as Stripe.Response<Stripe.PaymentMethod>;
      this.throwStripeError(error);
    }
    return new CardDTO(result);
  }

  /**
   * Attach payment card to customer
   */
  public async addCardToCustomer(dto: AddCardToCustomerDTO): Promise<PaymentCardDTO> {
    const { paymentMethods } = this._stripeClient;
    const { cardId, stripeCustomerToken } = dto;
    let result: Stripe.Response<Stripe.PaymentMethod>;
    try {
      const { customer } = await this.getCardInfo(cardId);
      if (customer === stripeCustomerToken) {
        throw new ApplicationError({
          statusCode: 409,
          errorCode: ERROR_CODES.conflict,
          errorMessage: 'Card already attached',
          errors: [],
        });
      }
      result = await paymentMethods.attach(cardId, { customer: stripeCustomerToken as string });
    } catch (error) {
      result = {} as Stripe.Response<Stripe.PaymentMethod>;
      this.throwStripeError(error);
    }
    return new CardDTO(result);
  }

  /**
   * Detach payment card from customer
   */
  public async removeCardFromCustomer(cardId: string): Promise<string> {
    const { paymentMethods } = this._stripeClient;
    let result: Stripe.Response<Stripe.PaymentMethod>;
    try {
      result = await paymentMethods.detach(cardId);
    } catch (error) {
      this.throwStripeError(error);
    }
    return result!.id;
  }
}
