/**
 * Description: Admin - User module interfaces
 */

import { NextFunction, Request, Response } from 'express';

export interface IUserAdminHandler {
  getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  changeEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleUserBlock(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
