/**
 * Description: Types for Headout API module
 */

import { BookingStatuses } from './enums';

export type HeadoutSettings = {
  url: string;
  key: string;
  authHeader: string;
};

export type HeadoutPersonType = 'ADULT' | 'CHILD' | 'INFANT' | 'SENIOR' | 'FAMILY' | 'STUDENT';
export type HeadoutPersonTypeName = 'Adult' | 'Child' | 'Infant' | 'Senior' | 'Family' | 'Student';

export type VariantPricing = {
  type: HeadoutPersonType;
  name: HeadoutPersonTypeName;
  ageFrom: number;
  ageTo: number;
  price: number;
  originalPrice: number;
};

export type HeadoutVariant = {
  id: number;
  startDateTime: string;
  endDateTime: string;
  availability: 'LIMITED' | 'UNLIMITED' | 'CLOSED';
  remaining: number;
  pricing: {
    persons: Array<VariantPricing>;
    groups: Array<any>;
  };
};

export type HeadoutVariantsDTO = {
  items: Array<HeadoutVariant>;
  nextUrl: string;
  prevUrl: string;
  total: number;
  nextOffset: string;
};

export type InputFields = {
  id: string;
  name: string;
  value: string;
};

export type Customers = {
  personType: HeadoutPersonType;
  isPrimary: boolean;
  inputFields: Array<InputFields>;
};

export type CustomersDetails = {
  count: number;
  customers: Array<Customers>;
};

export type VariantInputFields = {
  id: string;
  value: string;
  name?: string;
};

export type BookingPrice = {
  amount: string;
  currencyCode: string;
};

export type HeadoutProduct = {
  id: number;
  name: string;
  variant: {
    id: number;
    name: string;
  };
};

export type CreateBookingDTO = {
  variantId: number; // variant id from Headout
  inventoryId: number; // inventory id from Headout (item_id of variant item)
  customersDetails: CustomersDetails;
  variantInputFields: Array<VariantInputFields>;
  price: BookingPrice;
};

export type BookingDTO = {
  bookingId: number;
  partnerReferenceId: string | null;
  variantId: number;
  startDateTime: string;
  product: HeadoutProduct;
  customersDetails: CustomersDetails;
  variantInputFields: Array<VariantInputFields>;
  price: BookingPrice;
  status: BookingStatuses;
  voucherUrl: string;
  tickets: Array<any>;
  creationTimestamp: number;
};

export type ExtendedBookingDTO = BookingDTO & {
  orderItemId: number;
};

export type BookingMeta = {
  bookingId: number;
  partnerReferenceId: string | null;
  status: BookingStatuses;
};

export type ExtendedBookingMeta = BookingMeta & {
  orderItemId: number;
};

export type ExtendedBookingMetaDTO = {
  amount: number;
  bookingMeta: Array<ExtendedBookingMeta>;
};

export type UpdateBookingDTO = {
  bookingId: number;
  status: BookingStatuses;
  partnerReferenceId: string | null;
};
