/**
 * Description: Types and interfaces for product entity
 */

import { NextFunction, Request, Response } from 'express';

import { CustomersIds } from 'utils/authentication';

import { VariantPricing } from '../headout';
import { CreatePaymentBase, PaymentStatuses } from '../payment';
import { AgeGroupOptions } from '../cart';
import { ProductMediaPositions, WalletTypes } from './product.enums';

export interface IProductHandler {
  getProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProductsBySearchString(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProductDetailsBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTop(req: Request, res: Response, next: NextFunction): Promise<void>;
  checkAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAvailableVariantDates(req: Request, res: Response, next: NextFunction): Promise<void>;
  getVariantItems(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAgeGroups(req: Request, res: Response, next: NextFunction): Promise<void>;
  getOrCreateOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
  purchaseProductBase(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export type CreateProductDTO = {
  name: string;
  articleType: string;
  categoryIds: Array<number>;
  ratingAvg: number;
  ratingCount: number;
  status: number;
  sourceId: number;
  metaKeyword?: string;
  metaDescription?: string;
};

export type CreateProductDetailsDTO = {
  productId: number;
  startAddressLine1: string;
  startAddressLine2: string;
  startCity: string;
  country: string;
  startPostalCode: string;
  startLatitude: string;
  startLongitude: string;
  hasMobileTicket: number;
  hasAudioAvailable: number;
};

export type Product = {
  id: number;
  productId: number;
  name: string;
  articleType: string;
  url: string;
  imageUrl: string;
  neighborhood: string;
  canonicalUrl: string;
  ratingAvg: number;
  ratingCount: number;
  pricingType: string;
  originalPrice: number;
  finalPrice: number;
  bestDiscount: number;
  metaTitle: string;
  metaAuthor: string;
  metaKeyword: string;
  metaDescription: string;
  slug: string;
  langCode: string;
  isSuggested: number;
  status: number;
  sourceId: number;
  currency: string;
  cityId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Variant = {
  id: number;
  variantId: number;
  productId: number;
  name: string;
  description: string;
  inventoryType: string;
  paxMin: number;
  paxMax: number;
  cashbackValue: number;
  cashbackType: string;
  ticketDeliveryInfo: string;
  inputFieldsId: string;
  inputFieldsLevel: string;
  canonicalUrl: string;
  metaKeyword: string;
  metaDescription: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
};

export type VariantItem = {
  itemId: number;
  variantId: number;
  startDateTime: Date;
  endDateTime: Date;
  availability: string;
  remaining: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  itemMetaInfo?: VariantPricing;
};

export type ProductMetaInfoDTO = {
  Summary: string;
  Highlights: string;
  FAQs: string;
  'Cancellation Policy': string;
  'Ticket Delivery Information': string;
  Inclusions: string;
  Exclusions: string;
};

export type ChangeGalleryPositionDTO = {
  id: number;
  position: number;
  type: ProductMediaPositions;
};

export type UpdateProductTopRequest = {
  topActivities: boolean;
  mostPopular: boolean;
};

export type CheckAvailabilityDTO = {
  variantId: number;
  variantItemId: number;
};

export type VariantsDTO = {
  headoutVariantId: number;
  variantName: string;
  startDateTime: string;
  endDateTime: string;
};

export type GetVariantItemsDTO = {
  productId: number;
  date: string; // dd/mm/yyyy
  variantId: number;
  sourceId: number;
};

export type GetAgeGroupsDTO = {
  productId: number;
  date: string; // dd/mm/yyyy
  variantId: number;
  variantItemId: number;
  sourceId: number;
};

export type CreateOrderDTO<T extends PurchaseProductUserDTO> = {
  customerIds: CustomersIds;
  body: T;
  order: OrderDTO;
  orderItemsMeta: Array<OrderItemDTO>;
};

export type OrderDTO = {
  id: number;
  userId: number;
  guestId: string;
  itineraryId: string;
  orderUuid: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  status: string;
  subTotal: number;
  netTotal: number;
  grandTotal: number;
  taxAmount: number;
  gatewayCharges: number;
  commissionCharges: number;
  discountAmount: number;
  couponCode: string;
  referalPointId: number;
  referralPoints: number;
  referaralDiscount: number;
  deviceType: number;
  ipAddress: string;
  currency: string;
  utmSource: string;
  utmMedium: string;
  bookingMsg: string;
  langCode: string;
  orderItemsMeta?: Array<OrderItemDTO>;
  orderPayment?: OrderPaymentDTO;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItemDTO = {
  id: number;
  orderId: number;
  date: string;
  productId: number;
  headoutProductId: number;
  productName: string;
  headoutVariantId: number;
  variantName: string;
  headoutVariantItemId: number;
  productOptions: string;
  isBooked: number;
  bookingId: string;
  inputFieldsId: string;
  inputFieldsLevel: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderPaymentDTO = {
  id: number;
  orderId: number;
  status: string;
  transactionId: string;
  referenceId: string;
  reason: string;
  totalPaid: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PurchaseProductUserDTO = {
  userName: string;
  userEmail: string;
  userPhone: string;
  promoCode?: string;
};

export type ProductPayment = CreatePaymentBase & {
  amount: number;
  description: string;
  currency: string;
  cardToken: string;
  stripeCustomerToken: string;
  cardId: string;
  walletType: WalletTypes;
};

export type PurchaseProductDTO = PurchaseProductUserDTO & {
  paymentInfo: ProductPayment;
};

export type TransactionDataDTO = {
  id: number;
  transactionId: string;
  status: PaymentStatuses;
};

export type Tickets = {
  name: string;
  time: string;
  date: string;
  ticketsCount: number;
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
