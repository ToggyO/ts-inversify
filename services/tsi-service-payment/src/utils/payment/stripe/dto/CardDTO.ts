/**
 * Description: Products module DTO
 */

import Stripe from 'stripe';

import { CardBrands, PaymentCardDTO } from 'utils/payment';

export class CardDTO implements PaymentCardDTO {
  public id: string;
  public type: Stripe.PaymentMethod.Type;
  public brand?: string | CardBrands;
  public last4digits?: string;
  public expMonth?: number;
  public expYear?: number;
  public country?: string | null;
  public customer: string | Stripe.Customer | null;

  constructor(card: Stripe.PaymentMethod) {
    this.id = card.id;
    this.type = card.type;
    this.brand = card?.card?.brand;
    this.last4digits = card?.card?.last4;
    this.expMonth = card?.card?.exp_month;
    this.expYear = card?.card?.exp_year;
    this.country = card.card?.country;
    this.customer = card.customer;
  }
}
