/**
 * Description: Stripe payment module service
 */

import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { autobind } from 'utils/helpers';
import { StripeValidator } from './stripe.validator';
import {
  IPaymentApi,
  CreateSinglePaymentDTO,
  PaymentDTO,
  CreateCustomerDTO,
  CustomerTokenDTO,
  CreateCustomerPaymentDTO,
  PaymentCardDTO,
  AddCardToCustomerDTO,
} from 'utils/payment';

import { IStripeService } from './interfaces';
import { BaseService } from '../../common';

@injectable()
export class StripeService extends BaseService implements IStripeService {
  constructor(@inject(TYPES.StripeApi) protected readonly stripe: IPaymentApi) {
    super();
    autobind(this);
  }

  /**
   * Create stripe customer
   */
  public async createCustomer(dto: CreateCustomerDTO): Promise<CustomerTokenDTO> {
    const driedValues = this.dryPayload<CreateCustomerDTO>(dto, this.createCustomerPayloadSchema());

    StripeValidator.createCustomerValidator(driedValues);

    return this.stripe.createCustomer(driedValues);
  }

  /**
   * Create payment for unauthorized user
   */
  public async createSinglePayment(dto: CreateSinglePaymentDTO): Promise<PaymentDTO> {
    const driedValues = this.dryPayload<CreateSinglePaymentDTO>(dto, this.createSinglePaymentPayloadSchema());

    StripeValidator.createSinglePaymentValidator(driedValues);

    return this.stripe.createSinglePayment({
      ...driedValues,
      amount: parseFloat(driedValues.amount.toString()) * 100,
    });
  }

  /**
   * Create payment for authorized customer
   */
  public async createCustomerPayment(dto: CreateCustomerPaymentDTO): Promise<PaymentDTO> {
    const driedValues = this.dryPayload<CreateCustomerPaymentDTO>(
      dto,
      this.createCustomerPaymentPayloadSchema(),
    );

    StripeValidator.createCustomerPaymentValidator(driedValues);

    return this.stripe.createCustomerPayment({
      ...driedValues,
      amount: parseFloat(driedValues.amount.toString()) * 100,
    });
  }

  /**
   * Get payment cards of customer
   */
  public async getCustomerCards(stripeCustomerToken: string): Promise<Array<PaymentCardDTO>> {
    StripeValidator.requiredParameterValidator<string>('stripeCustomerToken', stripeCustomerToken);
    return this.stripe.getCustomerCards(stripeCustomerToken);
  }

  /**
   * Get payment card info
   */
  public async getCardInfo(cardId: string): Promise<PaymentCardDTO> {
    StripeValidator.requiredParameterValidator<string>('cardId', cardId);
    return this.stripe.getCardInfo(cardId);
  }

  /**
   * Attach payment card to customer
   */
  public async addCardToCustomer(dto: AddCardToCustomerDTO): Promise<PaymentCardDTO> {
    const driedValues = this.dryPayload<AddCardToCustomerDTO>(dto, this.addCardToCustomerPayloadValidator());

    StripeValidator.addToCardToCustomerPayloadValidator(driedValues);

    return this.stripe.addCardToCustomer(driedValues);
  }

  /**
   * Detach payment card from customer
   */
  public async removeCardFromCustomer(cardId: string): Promise<string> {
    StripeValidator.requiredParameterValidator<string>('cardId', cardId);
    return this.stripe.removeCardFromCustomer(cardId);
  }

  /**
   * Data transformation schema for customer creation
   */
  private createCustomerPayloadSchema(): Record<string, (arg: any) => any> {
    return {
      email: (value: string) => value,
      firstName: (value: string) => value,
      lastName: (value: string) => value,
    };
  }

  /**
   * Data transformation schema for single payment
   */
  private createSinglePaymentPayloadSchema(): Record<string, (arg: any) => any> {
    return {
      cardToken: (value: string) => value,
      description: (value: string) => value,
      amount: (value: number) => value,
      currency: (value: string) => value,
      email: (value: string) => value,
    };
  }

  /**
   * Data transformation schema for customer payment
   */
  private createCustomerPaymentPayloadSchema(): Record<string, (arg: any) => any> {
    return {
      cardId: (value: string) => value,
      description: (value: string) => value,
      amount: (value: number) => value,
      currency: (value: string) => value,
      email: (value: string) => value,
      stripeCustomerToken: (value: string) => value,
    };
  }

  /**
   * Data transformation schema for attaching payment card to customer
   */
  private addCardToCustomerPayloadValidator(): Record<string, (arg: any) => any> {
    return {
      cardId: (value: string) => value,
      stripeCustomerToken: (value: string) => value,
    };
  }
}
