/**
 * Description: Types for promo-codes entity
 */

import { PromoCodeTypes } from 'constants/common';

export type CreatePromoCodeDTO = {
  couponName: string;
  promoCode: string;
  tAndC: string;
  couponType: PromoCodeTypes;
  couponValue: number;
  couponQty: number;
  availableDays: string[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  includeApiData: boolean;
  userRedemptionLimit: number;
  minCartAmount: number;
};

export type CreatePromoCode = {
  couponName: string;
  generationType: string;
  promoCode: string;
  couponQty: number;
  tAndC: string;
  couponType: PromoCodeTypes;
  couponValue: number;
  availableDays: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  excludeWalletPoint?: number;
  includeApiData: boolean;
  userRedemptionLimit: number;
  remainUserRedemptionLimit?: number;
  minCartAmount: number;
  usesCount?: number;
  batchQty?: number;
  status?: number;
  deviceType?: number;
};

export type CreatePromoCodeUsesDTO = {
  promoCodeId: number;
  usesCount: number;
  userId?: number;
  guestId?: number;
};

export type DiscountDTO = {
  discountAmount: number;
  discountType: PromoCodeTypes;
};
