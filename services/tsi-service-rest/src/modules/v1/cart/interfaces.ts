/**
 * Description: Interfaces for shopping cart module
 */

import { NextFunction, Request, Response } from 'express';

export interface ICartHandler {
  getCart(req: Request, res: Response, next: NextFunction): Promise<void>;
  addToCart(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateCart(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeItemFromCart(req: Request, res: Response, next: NextFunction): Promise<void>;
}
