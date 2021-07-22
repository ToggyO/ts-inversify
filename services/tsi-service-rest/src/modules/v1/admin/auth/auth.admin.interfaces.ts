/**
 * Description: Admin - Auth module interfaces
 */

import { NextFunction, Request, Response } from 'express';

import { ExtendedRequest } from 'declaration';

export interface IAuthAdminHandler {
  login(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  restorePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
}
