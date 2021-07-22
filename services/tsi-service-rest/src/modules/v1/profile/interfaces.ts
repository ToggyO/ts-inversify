/**
 * Description: Interfaces for profile module
 */

import { NextFunction, Request, Response } from 'express';
import { ExtendedRequest } from 'declaration';

export interface IProfileHandler {
  getProfile(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  updateProfile(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  changePassword(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  updateProfilePic(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  getFavouriteProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
  favouriteProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
  getListOfBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
}
