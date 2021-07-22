/**
 * Description: Types and interfaces for Headout API service
 */

import { HeadoutPersonType, HeadoutPersonTypeName } from 'utils/headout';

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

export type HeadoutVariantAvailabilityDTO = {
  available: boolean;
  tickets: HeadoutVariant | string;
};

export type VariantAvailabilityDTO = HeadoutVariantAvailabilityDTO & {
  headoutVariantId: number;
  variantName: string;
};

export type BookingIdsDTO = {
  bookingId: string;
  orderItemId: number;
};
