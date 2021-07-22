/**
 * Description: Types and interfaces for city entity
 */

import { NextFunction, Request, Response } from 'express';
import { FindOptions, UpdateOptions } from 'sequelize';

import {
  GetEntityPayload,
  GetEntityResponse,
  GetListResponse,
  GetParameters,
  IBaseService,
  RequestQueries,
} from 'modules/interfaces';

import { CityModel } from './city.model';

export interface ICityHandler {
  getCities(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCityById(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTop(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface ICityEntityService extends IBaseService {
  getEntityResponse(payload: GetEntityPayload): Promise<GetEntityResponse<CityModel>>;
  getCities(query: RequestQueries): Promise<GetListResponse<CityModel>>;
  getCityById(cityId: number, query: RequestQueries): Promise<GetEntityResponse<CityModel>>;
  updateCityTopById(cityId: number, payload: UpdateCityTopPayload): Promise<GetEntityResponse<CityModel>>;
}

export interface ICityRepository {
  getCities(params: GetParameters): Promise<GetListResponse<CityModel>>;
  getCity(options: FindOptions): Promise<CityModel | null>;
  updateCity(
    payload: UpdateCityTopPayload,
    options: UpdateOptions<CityModel>,
  ): Promise<[number, CityModel[]]>;
}

export type CityModelType = typeof CityModel;

export type City = {
  id: number;
  name: string;
  code: string;
  top: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateCityTopRequest = {
  topDestination: boolean;
  topToVisit: boolean;
};

export type UpdateCityTopPayload = {
  topDestination: boolean;
  topToVisit: boolean;
};
