/**
 * Description: Admin - Promo codes module types
 */

export type CreatePromoCodeDTO = {
  couponName: string;
  promoCode: string;
  tAndC: string;
  couponType: string;
  couponValue: number;
  couponQty: number;
  availableDays: Array<string>;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  includeApiData: boolean;
  userRedemptionLimit: number;
  minCartAmount: number;
};

export type PromoCode = {
  id: number;
  couponName: string;
  generationType: string;
  promoCode: string;
  couponQty: number;
  tAndC: string;
  couponType: string;
  couponValue: number;
  availableDays: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  deviceType: number;
  excludeWalletPoint: number;
  includeApiData: number;
  userRedemptionLimit: number;
  remainUserRedemptionLimit: number;
  minCartAmount: number;
  usesCount: number;
  batchQty: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
};
