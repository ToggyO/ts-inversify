/**
 * Description: Admin - Auth module controller
 */

import { Response, NextFunction, Request } from 'express';
import { AxiosResponse } from 'axios';
import { Queue } from 'bull';
import { injectable, inject } from 'inversify';

import { ExtendedRequest } from 'declaration';
import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { getSuccessRes, Success } from 'utils/response';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { autobind, getProp, Mails } from 'utils/helpers';
import { AuthDTO, LoginPayload, ResetPasswordDTO, RestorePasswordDTO } from 'modules/v1/auth';
import { IIdentityHelpers } from 'utils/authentication';
import { IQueueRegistry, MailQueueDTO } from 'utils/queue';

import { IAuthAdminHandler } from './auth.admin.interfaces';
import { Admin, RestorePasswordAdminDTO } from './auth.admin.types';

const { ADMIN, getDataServiceUrl } = SERVICE_ENDPOINTS;

@injectable()
export class AuthAdminController extends BaseController implements IAuthAdminHandler {
  private readonly _mailQueue: Queue<MailQueueDTO>;

  constructor(
    @inject(TYPES.IConfiguration) protected readonly _configService: IConfiguration,
    @inject(TYPES.IIdentityHelpers) protected readonly _identityHelpers: IIdentityHelpers,
    @inject(TYPES.IQueueRegistry) queueRegistry: IQueueRegistry,
  ) {
    super();
    autobind(this);
    const maiQueueName = this._configService.get<string>('QUEUE_NAME_MAIL', '');
    this._mailQueue = queueRegistry.getQueue<MailQueueDTO>(maiQueueName);
  }

  /**
   * Log in as admin
   */
  public async login(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<LoginPayload>(req, 'body', {});
      const response: AxiosResponse<Success<Admin>> = await this.axios.post(
        getDataServiceUrl(ADMIN.AUTH.CHECK_CREDENTIALS_REQUEST),
        body,
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      const authDTO = this._setTokenToSession(req, resultData);
      res.status(200).send(
        getSuccessRes<AuthDTO<Admin>>({ resultData: authDTO }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset admin password by special token
   */
  public async restorePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email = getProp<string>(req, 'body.email', {});
      const sendMailJob = this._configService.get<string>('QUEUE_JOB_NAME_SEND_EMAIL', '');
      const restorePasswordLink = this._configService.get<string>('RESTORE_PASSWORD_ADMIN_LINK', '');
      const appDomain = this._configService.get<string>('ADMIN_APP_DOMAIN', '');

      const response: AxiosResponse<Success<
        RestorePasswordAdminDTO
      >> = await this.axios.patch(getDataServiceUrl(ADMIN.AUTH.RESTORE_PASSWORD_REQUEST), { email });
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;

      if (resultData) {
        const { name, email, token } = resultData;
        this._mailQueue.add(
          sendMailJob,
          Mails.sendAdminRestorePassword(`${appDomain}${restorePasswordLink}?token=${token}`, {
            email,
            name,
          } as Admin),
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
        getDataServiceUrl(ADMIN.AUTH.RESET_PASSWORD_REQUEST),
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
   * Helper: sets JWT token to session object
   */
  private _setTokenToSession(req: ExtendedRequest, user: Admin): AuthDTO<Admin> {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: true,
    };
    req.session!.token = this._identityHelpers.generateToken(payload);
    req.session!.user = payload;
    return { user };
  }
}
