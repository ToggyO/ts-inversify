/**
 * Description: Types and interfaces for itinerary(Shopping cart) entity
 */

import { Request, Response, NextFunction } from 'express';
import { CreateOptions, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';

import { GetEntityPayload, GetEntityResponse, GetListResponse, GetParameters } from 'modules/interfaces';

import { ItineraryModel } from './itinerary.model';
import { ItineraryItemModel } from '../itinerary-item';

export interface IItineraryHandler {
  getItineraryWithItems(req: Request, res: Response, next: NextFunction): Promise<void>;
  manageItinerary(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateItinerary(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeItineraryItem(req: Request, res: Response, next: NextFunction): Promise<void>;
  bookItineraryItems(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IItineraryEntityService {
  getEntityResponse(payload: GetEntityPayload): Promise<GetEntityResponse<ItineraryModel>>;
  getItineraryWithItems(dto: GetItineraryWithItemsDTO): Promise<ItineraryModel | null>;
  manageItinerary(dto: ManageItineraryDTO): Promise<ItineraryItemDTO | null>;
  updateItinerary(dto: UpdateItemOfItineraryDTO): Promise<number | null>;
  removeItineraryWithItems(itineraryId: number): Promise<number>;
  removeItineraryItem(dto: RemoveItineraryItemDTO): Promise<number>;
  bookItineraryItems(dto: GetItineraryWithItemsDTO): Promise<void>;
}

export interface IItineraryRepository {
  getItineraries(payload: GetParameters): Promise<GetListResponse<ItineraryModel>>;
  getItinerary(payload: FindOptions): Promise<ItineraryModel | null>;
  createItinerary(dto: CreateItineraryDTO, options?: CreateOptions<ItineraryModel>): Promise<ItineraryModel>;
  updateItinerary(
    dto: Partial<UpdateItineraryDTO>,
    options: UpdateOptions<ItineraryModel>,
  ): Promise<[number, Array<ItineraryModel>]>;
  deleteItinerary(options: DestroyOptions<ItineraryModel>): Promise<number>;
}

export type ItineraryModelType = typeof ItineraryModel;

export type ItineraryItemModelType = typeof ItineraryItemModel;

export type AgeGroupOptions = {
  name: string;
  orderedQty: number;
  originalPrice: number;
  totalPrice: number;
  ageFrom: number | null;
  ageTo: number | null;
};

export type GetItineraryWithItemsDTO = {
  userId?: number;
  guestId?: number;
};

export type CreateItineraryDTO = {
  userId?: number;
  guestId?: number;
  itineraryDate?: string;
  status: number;
  name: string;
};

export type UpdateItineraryDTO = {
  userId?: number;
  guestId?: number;
  itineraryDate?: string;
  status: number;
  name: string;
};

export type ManageItineraryDTO = {
  userId?: number;
  guestId?: number;
  itineraryDate: string; // dd/mm/yyyy
  productId: number;
  variantId: number;
  headoutVariantId: number;
  variantName: string;
  variantItemId: number;
  headoutVariantItemId: number;
  slotDateTime: string;
  ageGroupOptions: Array<AgeGroupOptions>;
};

export type ItineraryItemDTO = {
  itineraryId: number;
  itineraryItemId: number;
  itineraryDate: string;
};

export type CreateItineraryWithItemDTO = ManageItineraryDTO & {
  productName: string;
  headoutProductId: number;
  sourceId?: number;
};

export type AddItineraryItem = CreateItineraryWithItemDTO & {
  itineraryId: number;
};

export type RemoveItineraryItemDTO = {
  itineraryItemId: number;
  guestId?: number;
  userId?: number;
};

export type UpdateItemOfItineraryDTO = {
  userId?: number;
  guestId?: number;
  itineraryId: number;
  itineraryItem: {
    id: number;
    ageGroupOptions: Array<AgeGroupOptions>;
  };
};
