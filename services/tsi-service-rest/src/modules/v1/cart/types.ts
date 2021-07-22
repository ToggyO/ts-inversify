/**
 * Description: Types for shopping cart module
 */

import { HeadoutPersonType } from 'utils/headout';

import { User } from '../user';

export type Cart = {
  id: number;
  deviceType: number;
  tokenId: string;
  name: string;
  searchLatitude: string;
  searchLongitude: string;
  startLatitude: string;
  startLongitude: string;
  endLatitude: string;
  endLongitude: string;
  status: number;
  visibility: number;
  itineraryRating: number;
  isVisited: number;
  isBooked: number;
  utmSource: string;
  utmMedium: string;
  createdAt: Date;
  updatedAt: Date;
  itemsOfItineraries?: Array<CartItem>;
  userByItinerary?: User;
};

export type CartItem = {
  id: number;
  itineraryId: number;
  productId: number;
  position: string;
  itineraryDate: Date;
  dateTime: string;
  variantId: number;
  variantItemId: number;
  productOptions: string;
  isExcluded: number;
  isBooked: number;
  source: number;
  deviceType: number;
  ratingCommentId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AgeGroupOptions = {
  name: HeadoutPersonType;
  orderedQty: number;
  originalPrice: number;
  totalPrice: number;
  ageFrom: number | null;
  ageTo: number | null;
};

export type AddToCartDTO = {
  itineraryDate: string; // dd/mm/yyyy
  variantId: number;
  productId: number;
  variantItemId: number;
  slotDateTime: string; // HH:mm - HH:mm
  ageGroupOptions: Array<AgeGroupOptions>;
};

export type CartItemDTO = {
  itineraryId: number;
  itineraryItemId: number;
  itineraryDate: string;
};

export type UpdateCartItemDTO = {
  itineraryId: number;
  itineraryItem: {
    id: number;
    ageGroupOptions: Array<AgeGroupOptions>;
  };
};
