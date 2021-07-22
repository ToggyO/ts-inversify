/**
 * Description: Prodile module controller for handling profile routing
 */

import { Response, NextFunction, Request } from 'express';
import { AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { injectable, inject } from 'inversify';

import { ExtendedRequest } from 'declaration';
import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { RequestQueries } from 'modules/interfaces';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { PROFILE_IMAGE_FIELD_NAME } from 'constants/file-upload';
import { ERROR_CODES } from 'constants/error-codes';
import { autobind, getProp } from 'utils/helpers';
import { ICloudinaryHelpers } from 'utils/cloudinary';
import { IProcessedFile } from 'utils/fileHandle';
import { ApplicationError, getSuccessRes, Success } from 'utils/response';

import { UpdateProfilePayload, User } from '../user/types';
import { IProfileHandler } from './interfaces';
import { BookingOfUserDTO, ChangePasswordDTO } from './types';
import { Product } from '../product';

const { PROFILE, USERS, getDataServiceUrl } = SERVICE_ENDPOINTS;

@injectable()
export class ProfileController extends BaseController implements IProfileHandler {
  constructor(
    @inject(TYPES.IConfiguration) private readonly _configService: IConfiguration,
    @inject(TYPES.ICloudinaryHelpers) protected readonly _cloudinaryHelpers: ICloudinaryHelpers,
  ) {
    super();
    autobind(this);
  }

  /**
   * Get current authenticated user profile
   */
  public async getProfile(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'user.id');

      const response: AxiosResponse<Success<User>> = await this.axios.get(
        getDataServiceUrl(USERS.GET_USER_BY_ID(id)),
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<User>({ resultData }),
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
      const body = getProp<UpdateProfilePayload>(req, 'body', {});

      const response: AxiosResponse<Success<User>> = await this.axios.patch(
        getDataServiceUrl(USERS.UPDATE_USER_REQUEST(id)),
        body,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<User>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set new password for current authenticated user
   */
  public async changePassword(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'user.id');
      const body = getProp<ChangePasswordDTO>(req, 'body', {});

      const response: AxiosResponse<Success<null>> = await this.axios.patch(
        getDataServiceUrl(PROFILE.CHANGE_PASSWORD_REQUEST),
        { id, ...body },
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
   * Update user profile image
   */
  public async updateProfilePic(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'user.id');
      const file = getProp<IProcessedFile>(req, 'file', {});

      if (!file) {
        throw new ApplicationError({
          statusCode: 409,
          errorCode: ERROR_CODES.conflict,
          errorMessage: 'File is required',
          errors: [],
        });
      }
      const avatarProcessingSettings = this._configService.get('files.settings.profileImage');
      const url = await this._cloudinaryHelpers.uploadBuffer(
        file.buffer,
        file.mimetype,
        avatarProcessingSettings,
      );

      const response: AxiosResponse<Success<{
        oldProfileImageUrl: string;
        user: User;
      }>> = await this.axios.patch(getDataServiceUrl(PROFILE.PROFILE_IMAGE_REQUEST(id)), {
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
        getSuccessRes<User>({ resultData: resultData.user }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get list of favourite products of user
   */
  public async getFavouriteProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'user.id');
      const query = getProp<RequestQueries>(req, 'query', {});
      const stringedQuery = stringify(query, { addQueryPrefix: true });

      const response: AxiosResponse<Success<Array<Product>>> = await this.axios.get(
        getDataServiceUrl(PROFILE.GET_FAVOURITES_REQUEST(id, stringedQuery)),
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;

      res.status(200).send(
        getSuccessRes<Array<Product>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add product to user's favourites by id
   */
  public async favouriteProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'user.id');
      const query = getProp<RequestQueries>(req, 'query', {});
      const body = getProp<{ productId: number }>(req, 'body', {});
      const stringedQuery = stringify(query, { addQueryPrefix: true });

      const response: AxiosResponse = await this.axios.patch(
        getDataServiceUrl(USERS.PATCH_FAVOURITE_PRODUCTS(id, stringedQuery)),
        body,
      );

      if (response.status !== 201) {
        this.throwNonSuccessResponseError(response);
      }

      res.status(201).send(getSuccessRes({ resultData: null }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get list of bookings of user
   */
  public async getListOfBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'user.id');
      const query = getProp<RequestQueries>(req, 'query', {});
      const stringedQuery = stringify(query, { addQueryPrefix: true });

      const response: AxiosResponse<Success<Array<BookingOfUserDTO>>> = await this.axios.get(
        getDataServiceUrl(PROFILE.GET_BOOKINGS_REQUEST(id, stringedQuery)),
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;

      res.status(200).send(
        getSuccessRes<Array<BookingOfUserDTO>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
