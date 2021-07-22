/**
 * Description: Types and interfaces for country entity
 */

import { NextFunction, Request, Response } from 'express';

export interface ICountryHandler {
  getCountries(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCountry(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAlphaCodes(req: Request, res: Response, next: NextFunction): Promise<void>;
  getDialCodes(req: Request, res: Response, next: NextFunction): Promise<void>;
}

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

export type DialCode = {
  id: number;
  dialCode: string;
};

export type AlphaCode = {
  id: number;
  code: string;
};
