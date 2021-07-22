/**
 * Description: Types and interfaces for city entity
 */

import { NextFunction, Request, Response } from 'express';

export interface ICityHandler {
  getCities(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCity(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTop(req: Request, res: Response, next: NextFunction): Promise<void>;
}

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
