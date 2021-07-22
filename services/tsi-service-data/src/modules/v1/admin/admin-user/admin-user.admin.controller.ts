/**
 * Description: Admin - Auth module controller
 */

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { getSuccessRes } from 'utils/response';
import { autobind, getProp } from 'utils/helpers';
import { ChangePasswordDTO, LoginPayload, ResetPasswordDTO } from 'modules/v1/user';

import { AdminModel } from './models/admin.model';
import { IAuthAdminHandler, IAuthAdminService } from './admin-user.admin.interfaces';
import { RestorePasswordAdminDTO, UpdateAdminDTO } from './admin-user.admin.types';
import { USER_ERROR_MESSAGES } from 'modules/v1/user/constants';

@injectable()
export class AdminUserAdminController extends BaseController implements IAuthAdminHandler {
  constructor(@inject(TYPES.IAuthAdminService) private readonly _service: IAuthAdminService) {
    super();
    autobind(this);
  }

  /**
   * Get admin by id
   */
  public async getAdminById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', null);
      const resultData = await this._service.getEntityResponse({ id });
      if (!resultData) {
        this.notFoundErrorPayload(USER_ERROR_MESSAGES.NOT_FOUND);
      }
      res.status(200).send(
        getSuccessRes<AdminModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check admin login credentials
   */
  public async checkLoginCredentials(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<LoginPayload>(req, 'body', {});
      const admin = await this._service.checkLoginCredentials(body);
      const resultData = await this._service.getEntityResponse({ id: admin!.id });
      res.status(200).send(
        getSuccessRes<AdminModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get restore password token
   */
  public async restorePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email = getProp<string>(req, 'body.email', null);
      const resultData = await this._service.restorePassword(email);
      res.status(200).send(
        getSuccessRes<RestorePasswordAdminDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset admin password by special token
   */
  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<ResetPasswordDTO>(req, 'body', {});
      const resultData = await this._service.resetPassword(body);
      res.status(200).send(getSuccessRes({ resultData }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update admin
   */
  public async updateAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, body } = this._getParams<UpdateAdminDTO>(req, 'id');
      await this._service.updateAdmin(id, body);
      const resultData = await this._service.getEntityResponse({ id });
      res.status(200).send(
        getSuccessRes<AdminModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update `profile_image` field of admin by id
   */
  public async updateProfileImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', null);
      const profileImage = getProp<string>(req, 'body.profileImage', null);
      const oldProfileImageUrl = await this._service.updateProfileImage(id, profileImage);
      const admin = await this._service.getEntityResponse({ id });
      res.status(200).send(
        getSuccessRes<{ oldProfileImageUrl: string; admin: AdminModel }>({
          resultData: {
            oldProfileImageUrl,
            admin: admin!,
          },
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change admin password
   */
  public async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { body } = this._getParams<ChangePasswordDTO>(req);
      const resultData = await this._service.changePassword(body);
      res.status(200).send(
        getSuccessRes<null>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
