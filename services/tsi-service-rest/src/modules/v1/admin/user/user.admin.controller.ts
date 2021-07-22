/**
 * Description: Admin - User module controller
 */

import { NextFunction, Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { Queue } from 'bull';
import { stringify } from 'qs';
import { inject, injectable } from 'inversify';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { GetListResponse, RequestQueries } from 'modules/interfaces';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { autobind, getProp, Mails } from 'utils/helpers';
import { getSuccessRes, Success } from 'utils/response';
import { CreatedUserByAdminData, CreateUserDTO, UpdateProfilePayload, User } from 'modules/v1/user';
import { IRedisHelpers } from 'utils/redis';
import { Session } from 'utils/authentication';
import { IQueueRegistry, MailQueueDTO } from 'utils/queue';
import { CustomerDTO } from 'modules/v1/auth';

import { IUserAdminHandler } from './user.admin.interfaces';
import { ChangeEmailDTO, ChangePasswordPayload } from './user.admin.types';

const { ADMIN, PAYMENT, USERS, getDataServiceUrl, getPaymentServiceUrl } = SERVICE_ENDPOINTS;

@injectable()
export class UserAdminController extends BaseController implements IUserAdminHandler {
  private readonly _redisTokenPrefix: string;
  protected readonly _mailQueue: Queue;

  constructor(
    @inject(TYPES.IConfiguration) private readonly _configService: IConfiguration,
    @inject(TYPES.IRedisHelpers) private readonly _redisHelpers: IRedisHelpers,
    @inject(TYPES.IQueueRegistry) queueRegistry: IQueueRegistry,
  ) {
    super();
    autobind(this);
    this._redisTokenPrefix = this._configService.get<string>('TSI_REDIS_TOKEN_PREFIX', '');
    const maiQueueName = this._configService.get<string>('QUEUE_NAME_MAIL', '');
    this._mailQueue = queueRegistry.getQueue<MailQueueDTO>(maiQueueName);
  }

  /**
   * Get list of users
   */
  public async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { stringedQuery } = await this._getParams(req);

      const response: AxiosResponse<Success<GetListResponse<User>>> = await this.axios.get(
        getDataServiceUrl(ADMIN.USERS.GET_USERS(stringedQuery)),
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<GetListResponse<User>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get users by id
   */
  public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = await this._getParams(req, 'userId');
      const resultData = await this.requestUser(id);
      res.status(200).send(
        getSuccessRes<User>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create user by administrator
   */
  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { body, stringedQuery } = await this._getParams<CreateUserDTO>(req);
      const sendMailJob = this._configService.get<string>('QUEUE_JOB_NAME_SEND_EMAIL', '');

      const dataServiceResponse: AxiosResponse<Success<{
        user: CreatedUserByAdminData;
      }>> = await this.axios.post(getDataServiceUrl(ADMIN.USERS.CREATE_REQUEST(stringedQuery)), body);

      if (dataServiceResponse.status !== 201) {
        this.throwNonSuccessResponseError(dataServiceResponse);
      }
      const { user } = dataServiceResponse.data.resultData;

      const updatedUser = await this._createStripeCustomerToken(
        {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
        },
        user.id,
      );

      this._mailQueue.add(
        sendMailJob,
        Mails.sendTemporaryPassword({
          name: user.firstName,
          email: user.email,
          temporaryPassword: user.temporaryPassword,
        }),
      );
      res.status(201).send(
        getSuccessRes<{ user: User }>({ resultData: { user: updatedUser } }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user info by id
   */
  public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = await this._getParams(req, 'userId');
      const body = getProp<UpdateProfilePayload>(req, 'body', {});
      const resultData = await this.updateUserRequest(id, body);
      res.status(200).send(getSuccessRes({ resultData }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change user's email
   */
  public async changeEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, body, stringedQuery } = this._getParams<ChangePasswordPayload>(req, 'userId');
      const sendMailJob = this._configService.get<string>('QUEUE_JOB_NAME_SEND_EMAIL', '');
      const appDomain = this._configService.get<string>('CLIENT_APP_DOMAIN', '');
      const contactUsLink = this._configService.get<string>('CONTACT_US_LINK', '');

      const response: AxiosResponse<Success<ChangeEmailDTO>> = await this.axios.patch(
        getDataServiceUrl(ADMIN.USERS.CHANGE_EMAIL_REQUEST(stringedQuery)),
        { ...body, id },
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;

      this._mailQueue.add(
        sendMailJob,
        Mails.sendChangeEmailNotification({
          email: resultData.newEmail,
          firstName: resultData.firstName,
        }),
      );
      this._mailQueue.add(
        sendMailJob,
        Mails.sendChangeEmailAlert({
          email: resultData.oldEmail,
          firstName: resultData.firstName,
          link: `${appDomain}${contactUsLink}`,
        }),
      );

      res.status(200).send(
        getSuccessRes<null>({ resultData: null }),
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
      const { id, stringedQuery } = this._getParams(req, 'userId');
      const response: AxiosResponse<Success<User>> = await this.axios.get(
        getDataServiceUrl(ADMIN.USERS.TOGGLE_BLOCK_REQUEST(id, stringedQuery)),
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      const sessionId = await this._redisHelpers.getAndDeserializeAsync<string>(`${id}`);
      const session = await this._redisHelpers.getAndDeserializeAsync<Session>(
        `${this._redisTokenPrefix}_${sessionId}`,
      );
      if (session) {
        delete session.token;
        delete session.user;
        await this._redisHelpers.serializeAndSetWithExpiration(
          `${this._redisTokenPrefix}_${sessionId}`,
          session,
        );
      }
      res.status(200).send(
        getSuccessRes<User>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user by id
   */
  public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = await this._getParams(req, 'userId');

      const response: AxiosResponse<Success<null>> = await this.axios.delete(
        getDataServiceUrl(USERS.DELETE_BY_ID(id)),
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
   * Request user from data service
   */
  private async requestUser(id: number): Promise<User> {
    const response: AxiosResponse<Success<User>> = await this.axios.get(
      getDataServiceUrl(ADMIN.USERS.GET_USER_BY_ID(id)),
    );

    if (response.status !== 200) {
      this.throwNonSuccessResponseError(response);
    }

    const { data } = response;
    const { resultData } = data;

    return resultData;
  }

  /**
   * Update user and get from data service
   */
  private async updateUserRequest(id: number, body: UpdateProfilePayload): Promise<User> {
    const response: AxiosResponse<Success<User>> = await this.axios.patch(
      getDataServiceUrl(USERS.UPDATE_USER_REQUEST(id)),
      body,
    );

    if (response.status !== 200) {
      this.throwNonSuccessResponseError(response);
    }

    const { data } = response;
    const { resultData } = data;

    return resultData;
  }
}
