/**
 * Description: Admin - Profile codes module interfaces
 */

import { NextFunction, Response } from 'express';

import { ExtendedRequest } from 'declaration';

export interface IProfileAdminHandler {
  getProfile(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  updateProfile(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  changePassword(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  updateProfilePic(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
}
