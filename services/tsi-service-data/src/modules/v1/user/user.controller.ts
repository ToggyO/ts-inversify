/**
 * Description: Users module controller for handling users routing
 */

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { BaseController } from 'modules/common';
import { GetEntityResponse, GetListResponse, RequestQueries } from 'modules/interfaces';
import { ApplicationError, getSuccessRes } from 'utils/response';
import { getProp, autobind } from 'utils/helpers';
import { ERROR_CODES } from 'constants/error-codes';
import { TYPES } from 'DIContainer/types';

import { UserModel } from './user.model';
import { IUserHandler, IUserEntityService } from './interfaces';
import {
  CreatedUserResponse,
  CreateUserDTO,
  UpdateUserDTO,
  LoginPayload,
  VerifyEmailPayload,
  SendNewOtpPayload,
  ResetPasswordDTO,
  ChangePasswordDTO,
  RestorePasswordDTO,
} from './types';
import { USER_ERROR_MESSAGES } from './constants';
import { ProductModel } from '../product';

@injectable()
export class UserController extends BaseController implements IUserHandler {
  constructor(@inject(TYPES.IUserEntityService) protected readonly userService: IUserEntityService) {
    super();
    autobind(this);
  }

  /**
   * Get list of users
   */
  public async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = getProp<RequestQueries>(req, 'query', {});

      const resultData = await this.userService.getUsers(query);

      res.status(200).send(
        getSuccessRes<GetListResponse<UserModel>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by id
   */
  public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);

      if (!id) {
        throw new ApplicationError(this.notFoundErrorPayload(USER_ERROR_MESSAGES.NOT_FOUND));
      }

      const resultData = await this.userService.getUserById(id);

      if (!resultData) {
        throw new ApplicationError(this.notFoundErrorPayload(USER_ERROR_MESSAGES.NOT_FOUND));
      }

      res.status(200).send(
        getSuccessRes<UserModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create user
   */
  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<CreateUserDTO>(req, 'body', {});

      let createdUserPayload;

      if (body.socialId) {
        createdUserPayload = await this.userService.createSocialNetworkUser(body);
      } else {
        createdUserPayload = await this.userService.createUser(body);
      }

      const resultData = await this.userService.getEntityResponse({ id: createdUserPayload.id });

      res.status(201).send(
        getSuccessRes<CreatedUserResponse>({
          resultData: {
            user: resultData,
            ...(createdUserPayload.otp ? { otp: createdUserPayload.otp } : {}),
          },
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check registration otp code
   */
  public async checkOtpCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<VerifyEmailPayload>(req, 'body', {});

      const isValid = await this.userService.checkOtpCode({ otp: body.otp, email: body.email });

      if (!isValid) {
        throw new ApplicationError({
          statusCode: 400,
          errorCode: ERROR_CODES.validation,
          errorMessage: USER_ERROR_MESSAGES.INVALID_OTP,
          errors: [],
        });
      }

      let resultData: GetEntityResponse<UserModel> | null = null;
      if (body.id) {
        resultData = await this.userService.getEntityResponse({ id: body.id });
      }

      res.status(200).send(getSuccessRes({ resultData }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check user's login credentials
   */
  public async checkLoginCredentials(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<LoginPayload>(req, 'body', {});

      const user = await this.userService.checkLoginCredentials(body);

      const resultData = await this.userService.getEntityResponse({ id: user!.id });

      res.status(200).send(
        getSuccessRes<UserModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send new otp code to email
   */
  public async sendNewOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<SendNewOtpPayload>(req, 'body', {});

      const resultData = await this.userService.sendNewOtp(body);

      res.status(200).send(getSuccessRes({ resultData }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user info by id
   */
  public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);

      if (!id) {
        throw new ApplicationError(this.notFoundErrorPayload(USER_ERROR_MESSAGES.NOT_FOUND));
      }

      const body = getProp<UpdateUserDTO>(req, 'body', {});

      await this.userService.updateUser(id, body);

      const resultData = await this.userService.getEntityResponse({ id });

      res.status(200).send(
        getSuccessRes<UserModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update `stripe_customer_token` field of user by user id
   */
  public async updateStripeCustomerToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', null);
      const stripeCustomerToken = getProp<string>(req, 'body.stripeCustomerToken', null);

      await this.userService.updateStripeCustomerToken(id, stripeCustomerToken);

      const resultData = await this.userService.getEntityResponse({ id });

      res.status(200).send(
        getSuccessRes<UserModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update `profile_image` field of user by user id
   */
  public async updateProfileImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', null);
      const profileImage = getProp<string>(req, 'body.profileImage', null);

      const oldProfileImageUrl = await this.userService.updateProfileImage(id, profileImage);
      const user = await this.userService.getEntityResponse({ id });

      res.status(200).send(
        getSuccessRes<{ oldProfileImageUrl: string; user: UserModel }>({
          resultData: { oldProfileImageUrl, user: user! },
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change user's password
   */
  public async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<ChangePasswordDTO>(req, 'body', {});
      const resultData = await this.userService.changePassword(body);
      res.status(200).send(getSuccessRes({ resultData }));
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

      const resultData = await this.userService.restorePassword(email);

      res.status(200).send(
        getSuccessRes<RestorePasswordDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset user's password by special token
   */
  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<ResetPasswordDTO>(req, 'body', {});

      const resultData = await this.userService.resetPassword(body);

      res.status(200).send(getSuccessRes({ resultData }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add product to user's favourites by id
   */
  public async favouriteProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);
      const action = getProp<'add' | 'remove'>(req, 'query.action', undefined);

      if (!id) {
        throw new ApplicationError(this.notFoundErrorPayload(USER_ERROR_MESSAGES.NOT_FOUND));
      }

      const body = getProp<{ productId: number }>(req, 'body', {});

      await this.userService.favouriteProducts({ userId: id, action, ...body });

      res.status(201).send(getSuccessRes({ resultData: null }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get favourite products of user
   */
  public async getFavouriteProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);
      const query = getProp<RequestQueries>(req, 'query', {});

      const resultData = await this.userService.getFavouriteProducts(id, query);

      res.status(200).send(
        getSuccessRes<GetListResponse<ProductModel>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user by id (DEV)
   */
  public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);

      if (!id) {
        throw new ApplicationError(this.notFoundErrorPayload(USER_ERROR_MESSAGES.NOT_FOUND));
      }

      const deletedRowsCount = await this.userService.deleteUser(id);

      if (deletedRowsCount === 0) {
        throw new ApplicationError(this.notFoundErrorPayload(USER_ERROR_MESSAGES.NOT_FOUND));
      }

      res.status(200).send(getSuccessRes({ resultData: null }));
    } catch (error) {
      next(error);
    }
  }
}
