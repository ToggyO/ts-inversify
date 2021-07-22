/**
 * Description: Admin - profile module controller
 */

import { Response, NextFunction } from 'express';
import { AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';

import { ExtendedRequest } from 'declaration';
import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { getSuccessRes, Success } from 'utils/response';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { autobind, getProp } from 'utils/helpers';
import { ICloudinaryHelpers } from 'utils/cloudinary';
import { ChangePasswordDTO } from 'modules/v1/profile';
import { PROFILE_IMAGE_FIELD_NAME } from 'constants/file-upload';

import { Admin } from '../auth/auth.admin.types';
import { IProfileAdminHandler } from './profile.admin.interfaces';
import { UpdateAdminDTO } from './profile.admin.types';

const { ADMIN, getDataServiceUrl } = SERVICE_ENDPOINTS;

@injectable()
export class ProfileAdminController extends BaseController implements IProfileAdminHandler {
  constructor(
    @inject(TYPES.IConfiguration) private readonly _configService: IConfiguration,
    @inject(TYPES.ICloudinaryHelpers) protected readonly _cloudinaryHelpers: ICloudinaryHelpers,
  ) {
    super();
    autobind(this);
  }

  /**
   * Get current authenticated admin profile
   */
  public async getProfile(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'user.id');
      const response: AxiosResponse<Success<Admin>> = await this.axios.get(
        getDataServiceUrl(ADMIN.PROFILE.PROFILE_REQUEST(id)),
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<Admin>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update current authenticated user profile
   */
  public async updateProfile(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'user.id');
      const body = getProp<UpdateAdminDTO>(req, 'body', {});
      const response: AxiosResponse<Success<Admin>> = await this.axios.put(
        getDataServiceUrl(ADMIN.PROFILE.PROFILE_REQUEST(id)),
        body,
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<Admin>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set new password for current authenticated admin
   */
  public async changePassword(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'user.id');
      const { body } = this._getParams<ChangePasswordDTO>(req);
      const response: AxiosResponse<Success<null>> = await this.axios.patch(
        getDataServiceUrl(ADMIN.PROFILE.CHANGE_PASSWORD_REQUEST),
        { ...body, id },
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(getSuccessRes({ resultData }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update admin profile image
   */
  public async updateProfilePic(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'user.id');
      const file = this._getFiles(req);

      const avatarProcessingSettings = this._configService.get('files.settings.profileImage');
      const url = await this._cloudinaryHelpers.uploadBuffer(
        file.buffer,
        file.mimetype,
        avatarProcessingSettings,
      );

      const response: AxiosResponse<Success<{
        oldProfileImageUrl: string;
        admin: Admin;
      }>> = await this.axios.patch(getDataServiceUrl(ADMIN.PROFILE.PROFILE_IMAGE_REQUEST(id)), {
        [PROFILE_IMAGE_FIELD_NAME]: url,
      });
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      const oldUrl = this._cloudinaryHelpers.getPublicImageIdFromUrl(resultData.oldProfileImageUrl);
      if (oldUrl) {
        this._cloudinaryHelpers.destroy(oldUrl);
      }
      res.status(200).send(
        getSuccessRes<Admin>({ resultData: resultData.admin }),
      );
    } catch (error) {
      next(error);
    }
  }
}
