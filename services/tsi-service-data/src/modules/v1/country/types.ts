/**
 * Description: Types and interfaces for country entity
 */

import { Request, Response, NextFunction } from 'express';
import { FindOptions } from 'sequelize';

import {
  GetEntityPayload,
  GetEntityResponse,
  GetListResponse,
  GetParameters,
  IBaseService,
  RequestQueries,
} from 'modules/interfaces';

import { CountryModel } from './country.model';

export interface ICountryHandler {
  getCountries(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCountryById(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAlphaCodes(req: Request, res: Response, next: NextFunction): Promise<void>;
  getDialCodes(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface ICountryEntityService extends IBaseService {
  getEntityResponse(payload: GetEntityPayload): Promise<GetEntityResponse<CountryModel>>;
  getCountries(params: GetParameters): Promise<GetListResponse<CountryModel>>;
  getCountryById(countryId: number, query?: RequestQueries): Promise<GetEntityResponse<CountryModel>>;
  getAlphaCodes(): Promise<Pick<CountryModel, 'id' & 'code'>>;
  getDialCodes(): Promise<Pick<CountryModel, 'id' & 'dialCode'>>;
}

export interface ICountryRepository {
  getCountries(payload: GetParameters): Promise<GetListResponse<CountryModel>>;
  getCountry(payload: FindOptions): Promise<CountryModel | null>;
}

export type CountryModelType = typeof CountryModel;

export type Country = {
  id: number;
  name: string;
  code: string;
  dialCode: string;
  currencyName: string;
  currencySymbol: string;
  currencyCode: string;
  createdAt: Date;
  updatedAt: Date;
};
