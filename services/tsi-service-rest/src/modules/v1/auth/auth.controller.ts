/**
 * Description: Auth module controller for handling users auth routing
 */

import { NextFunction, Request, Response } from 'express';
import { Queue } from 'bull';
import { AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';

import { IConfiguration } from 'config';
import { ExtendedRequest } from 'declaration';
import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { ApplicationError, getSuccessRes, Success } from 'utils/response';
import { autobind, getProp, Mails } from 'utils/helpers';
import { IIdentityHelpers } from 'utils/authentication';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { CreatedUserResponse, CreateUserDTO, User } from 'modules/v1/user/types';
import { IQueueRegistry, MailQueueDTO } from 'utils/queue';
import { IGoogleClient } from 'utils/googleClient';
import { IFacebookClient } from 'utils/facebookClient';
import { IRedisHelpers } from 'utils/redis';

import {
  AuthDTO,
  CustomerDTO,
  FacebookAccessPayload,
  GoogleAccessPayload,
  IAuthHandler,
  LoginPayload,
  ResetPasswordDTO,
  RestorePasswordDTO,
  SendNewOtpPayload,
  SendNewOtpResponse,
  VerifyEmailPayload,
  VerifyEmailWithAuthPayload,
} from './types';
import { BlockStatuses } from 'constants/block-statuses';
import { ERROR_CODES } from 'constants/error-codes';

const { AUTH, USERS, PAYMENT, getDataServiceUrl, getPaymentServiceUrl } = SERVICE_ENDPOINTS;

@injectable()
export class AuthController extends BaseController implements IAuthHandler {
  protected readonly redisTokenPrefix: string;
  protected readonly identityHeader: string;
  protected readonly _mailQueue: Queue<MailQueueDTO>;

  constructor(
    @inject(TYPES.IConfiguration) protected readonly configService: IConfiguration,
    @inject(TYPES.IGoogleClient) protected readonly googleClient: IGoogleClient,
    @inject(TYPES.IFacebookClient) protected readonly facebookClient: IFacebookClient,
    @inject(TYPES.IIdentityHelpers) protected readonly _identityHelpers: IIdentityHelpers,
    @inject(TYPES.IRedisHelpers) protected readonly redisHelpers: IRedisHelpers,
    @inject(TYPES.IQueueRegistry) queueRegistry: IQueueRegistry,
  ) {
    super();
    autobind(this);
    this.redisTokenPrefix = this.configService.get<string>('TSI_REDIS_TOKEN_PREFIX', '');
    this.identityHeader = this.configService.get<string>('IDENTITY_HEADER', '');
    const maiQueueName = this.configService.get<string>('QUEUE_NAME_MAIL', '');
    this._mailQueue = queueRegistry.getQueue<MailQueueDTO>(maiQueueName);
  }

  /**
   * Log in as user by email
   */
  public async loginWithEmail(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<LoginPayload>(req, 'body', {});

      const response: AxiosResponse<Success<User>> = await this.axios.post(
        getDataServiceUrl(AUTH.CHECK_CREDENTIALS_REQUEST),
        body,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData: user } = data;

      this._checkIsBlocked(user);
      const authDTO = await this.setTokenToSession(req, user);

      res.status(200).send(
        getSuccessRes<AuthDTO<User>>({ resultData: authDTO }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log in as user by google
   */
  public async loginWithGoogle(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<GoogleAccessPayload>(req, 'body', {});

      const googleUser = await this.googleClient.googleAuth(body.idToken);

      const payload = {
        firstName: googleUser!['given_name'],
        lastName: googleUser!['family_name'],
        phoneNumber: null,
        email: googleUser!.email,
        socialId: googleUser!.sub,
        socialType: 'google',
        profileImage: googleUser!.picture,
      };

      const loginPayload = await this._createSocialUserRequest(req, payload);

      res.status(200).send(
        getSuccessRes<AuthDTO<User>>({ resultData: loginPayload }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log in as user by facebook
   */
  public async loginWithFacebook(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<FacebookAccessPayload>(req, 'body', {});

      const facebookUser = await this.facebookClient.facebookAuth(body.accessToken);

      const payload = {
        firstName: facebookUser!['first_name'],
        lastName: facebookUser!['last_name'],
        phoneNumber: null,
        email: facebookUser!.email,
        socialId: facebookUser!.id,
        socialType: 'facebook',
        profileImage: facebookUser?.data?.url,
      };

      const loginPayload = await this._createSocialUserRequest(req, payload);

      res.status(200).send(
        getSuccessRes<AuthDTO<User>>({ resultData: loginPayload }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check registration data of user and send otp code
   */
  public async registration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<CreateUserDTO>(req, 'body', {});
      const sendMailJob = this.configService.get<string>('QUEUE_JOB_NAME_SEND_EMAIL', '');

      const dataServiceResponse: AxiosResponse<Success<{
        user: User;
        otp?: string;
      }>> = await this.axios.post(getDataServiceUrl(USERS.CREATE_USER), {
        ...body,
      });

      if (dataServiceResponse.status !== 201) {
        this.throwNonSuccessResponseError(dataServiceResponse);
      }

      const { data } = dataServiceResponse;
      const { resultData } = data;
      const { otp, user } = resultData as CreatedUserResponse;

      const updatedUser = await this._createStripeCustomerToken(
        {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
        },
        user.id,
      );

      this._mailQueue.add(sendMailJob, Mails.sendOtp(otp, user));

      res.status(201).send(
        getSuccessRes<{ user: User }>({ resultData: { user: updatedUser } }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify email by otp code
   */
  public async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<VerifyEmailPayload>(req, 'body', {});

      const response: AxiosResponse<Success<User>> = await this.axios.post(
        getDataServiceUrl(AUTH.CHECK_OTP_CODE_REQUEST),
        body,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      res.status(200).send(getSuccessRes({ resultData: null }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify email by otp code after login
   */
  public async verifyEmailWithAuth(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<VerifyEmailWithAuthPayload>(req, 'body', {});

      const response: AxiosResponse<Success<User>> = await this.axios.post(
        getDataServiceUrl(AUTH.CHECK_OTP_CODE_REQUEST),
        body,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData: user } = data;

      const authDTO = await this.setTokenToSession(req, user);

      res.status(200).send(
        getSuccessRes<AuthDTO<User>>({ resultData: authDTO }),
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
      const sendMailJob = this.configService.get<string>('QUEUE_JOB_NAME_SEND_EMAIL', '');

      const response: AxiosResponse<Success<SendNewOtpResponse>> = await this.axios.post(
        getDataServiceUrl(AUTH.SEND_NEW_OTP_REQUEST),
        body,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      if (resultData !== null) {
        const { email, firstName, otp } = resultData;
        this._mailQueue.add(sendMailJob, Mails.sendOtp(otp, { email, firstName } as User));
      }

      res.status(201).send(
        getSuccessRes<User>({ resultData: null }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset user's password by special token
   */
  public async restorePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email = getProp<string>(req, 'body.email', {});
      const sendMailJob = this.configService.get<string>('QUEUE_JOB_NAME_SEND_EMAIL', '');
      const restorePasswordLink = this.configService.get<string>('RESTORE_PASSWORD_LINK', '');
      const appDomain = this.configService.get<string>('CLIENT_APP_DOMAIN', '');

      const response: AxiosResponse<Success<RestorePasswordDTO>> = await this.axios.post(
        getDataServiceUrl(AUTH.RESTORE_PASSWORD_REQUEST),
        { email },
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { resultData } = response.data;

      if (resultData) {
        const { firstName, email, token } = resultData;
        this._mailQueue.add(
          sendMailJob,
          Mails.sendRestorePassword(`${appDomain}${restorePasswordLink}?token=${token}`, {
            email,
            firstName,
          } as User),
        );
      }

      res.status(200).send(
        getSuccessRes<RestorePasswordDTO>({ resultData: null }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set a password for the user
   */
  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<ResetPasswordDTO>(req, 'body', {});

      const response: AxiosResponse<Success<null>> = await this.axios.patch(
        getDataServiceUrl(AUTH.RESET_PASSWORD_REQUEST),
        body,
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
   * Log out
   */
  public async logout(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.redisHelpers.deleteAsync(`${this.redisTokenPrefix}_${req.session!.sessionId}`);
      if (req.session?.user) {
        await this.redisHelpers.deleteAsync(`${req.session.user.id}`);
      }
      delete req.session;
      res.setHeader(this.identityHeader, '');
      res.status(200).send(getSuccessRes({ resultData: null }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Helper: sets JWT token to session object
   */
  protected async setTokenToSession(req: ExtendedRequest, user: User): Promise<AuthDTO<User>> {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
      isBlocked: user.isBlocked,
    };
    req.session!.token = this._identityHelpers.generateToken(payload);
    req.session!.user = payload;
    return { user };
  }

  /**
   * Helper: make request to create user by social type in database and return
   */
  protected async _createSocialUserRequest<T = any>(
    req: ExtendedRequest,
    payload: T,
  ): Promise<AuthDTO<User>> {
    const response: AxiosResponse<Success<{ user: User; otp?: string }>> = await this.axios.post(
      getDataServiceUrl(USERS.CREATE_USER),
      payload,
    );

    if (response.status !== 201) {
      this.throwNonSuccessResponseError(response);
    }

    const { resultData } = response.data;
    let { user } = resultData;

    if (!user.stripeCustomerToken) {
      user = await this._createStripeCustomerToken(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        user.id,
      );
    }

    this._checkIsBlocked(user);

    return this.setTokenToSession(req, user);
  }

  /**
   * Throw exception if user is blocked
   */
  private _checkIsBlocked(user: User): void {
    if (user.isBlocked === BlockStatuses.Blocked) {
      throw new ApplicationError({
        statusCode: 403,
        errorMessage: 'User is blocked',
        errorCode: ERROR_CODES.security__blocked,
        errors: [],
      });
    }
  }
}
