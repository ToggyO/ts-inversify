/**
 * Description: Admin - Users module interfaces
 */

import { NextFunction, Request, Response } from 'express';
import { Includeable } from 'sequelize';

import { RequestQueries } from 'modules/interfaces';
import { ChangeEmailDTO } from 'modules/v1/user';

export interface IUserAdminHandler {
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  changeEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleUserBlock(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IUserAdminService {
  changeEmail(userId: number, newEmail: string): Promise<ChangeEmailDTO>;
  toggleBlockUser(userId: number, query: RequestQueries): Promise<Array<Includeable>>;
}
