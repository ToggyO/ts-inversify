/**
 * Description: Admin - Users module controller
 */

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { getSuccessRes } from 'utils/response';
import { getProp, autobind, Generator } from 'utils/helpers';
import {
  ChangeEmailDTO,
  ChangeEmailPayload,
  CreateUserDTO,
  IUserEntityService,
  UserModel,
} from 'modules/v1/user';

import { IUserAdminHandler, IUserAdminService } from './user.admin.interfaces';

@injectable()
export class UserAdminController extends BaseController implements IUserAdminHandler {
  constructor(
    @inject(TYPES.IUserAdminService) private readonly _adminService: IUserAdminService,
    @inject(TYPES.IUserEntityService) private readonly _usersService: IUserEntityService,
  ) {
    super();
    autobind(this);
  }

  /**
   * Create user by administrator
   */
  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<CreateUserDTO>(req, 'body', {});
      body.password = Generator.generatePassword();
      const user = await this._usersService.createUserByAdmin(body);
      res.status(201).send(
        getSuccessRes({
          resultData: { user },
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change user's email
   */
  public async changeEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<ChangeEmailPayload>(req, 'body', {});
      const resultData = await this._adminService.changeEmail(body.id, body.email);
      res.status(200).send(
        getSuccessRes<ChangeEmailDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Block/Unblock user
   */
  public async toggleUserBlock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, query } = this._getParams(req, 'userId');
      const include = await this._adminService.toggleBlockUser(id, query);
      const resultData = await this._usersService.getEntityResponse({ id, include });
      res.status(200).send(
        getSuccessRes<UserModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
