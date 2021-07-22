/**
 * Description: Admin - Promo codes module interfaces
 */

import { NextFunction, Request, Response } from 'express';

export interface IPromoCodeHandler {
  getPromoCodesList(req: Request, res: Response, next: NextFunction): Promise<void>;
  createPromoCode(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleActivity(req: Request, res: Response, next: NextFunction): Promise<void>;
  removePromoCode(req: Request, res: Response, next: NextFunction): Promise<void>;
}
