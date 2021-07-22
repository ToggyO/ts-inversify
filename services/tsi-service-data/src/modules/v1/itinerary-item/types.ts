/**
 * Description: Types and interfaces for itinerary item entity
 */

import { CreateOptions, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';

import { GetListResponse, GetParameters } from 'modules/interfaces';

import { ItineraryItemModel } from './itinerary-item.model';

export interface IItineraryItemRepository {
  getItineraryItems(payload: GetParameters): Promise<GetListResponse<ItineraryItemModel>>;
  getItineraryItem(payload: FindOptions): Promise<ItineraryItemModel | null>;
  createItineraryItem(
    dto: CreateItineraryItemDTO,
    options?: CreateOptions<ItineraryItemModel>,
  ): Promise<ItineraryItemModel>;
  updateItineraryItem(
    dto: Partial<UpdateItineraryItemDTO>,
    options: UpdateOptions<ItineraryItemModel>,
  ): Promise<[number, Array<ItineraryItemModel>]>;
  deleteItineraryItem(options: DestroyOptions<ItineraryItemModel>): Promise<number>;
}

export type CreateItineraryItemDTO = {
  itineraryId: number;
  itineraryDate: string;
  productId: number;
  headoutProductId: number;
  position: number;
  dateTime: string;
  variantId: number;
  headoutVariantId: number;
  variantName: string;
  variantItemId: number;
  headoutVariantItemId: number;
  totalPrice: number;
  productName: string;
  productOptions: string;
  source: number;
};

export type UpdateItineraryItemDTO = {
  itineraryId: number;
  itineraryDate: string;
  productId: number;
  position: number;
  dateTime: string;
  variantId: number;
  variantItemId: number;
  productOptions: string;
  totalPrice: number;
  source: number;
  isBooked: number;
};
