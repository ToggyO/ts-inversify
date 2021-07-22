/**
 * Description: Class described work with Facebook Auth API
 */

import crypto from 'crypto';
import { inject, injectable } from 'inversify';
import { AxiosInstance, AxiosResponse } from 'axios';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { ApplicationError } from 'utils/response';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { unauthorizedErrorPayload } from 'constants/error-codes';

import { FacebookUser, IFacebookClient, LongLivedAccessTokenData } from './types';

const { AUTH } = SERVICE_ENDPOINTS;

@injectable()
export class FacebookClient implements IFacebookClient {
  constructor(
    @inject(TYPES.IConfiguration) protected readonly configService: IConfiguration,
    @inject(TYPES.IAxiosInstance) protected readonly axios: AxiosInstance,
  ) {}

  public async facebookAuth(shortTermAccessToken: string): Promise<FacebookUser> {
    const FACEBOOK_APP_GRAPH_API_VERSION = this.configService.get<string>(
      'FACEBOOK_APP_GRAPH_API_VERSION',
      '',
    );
    const FACEBOOK_APP_CLIENT_ID = this.configService.get<string>('FACEBOOK_APP_CLIENT_ID', '');
    const FACEBOOK_APP_CLIENT_SECRET = this.configService.get<string>('FACEBOOK_APP_CLIENT_SECRET', '');

    try {
      const accessTokenRequest: AxiosResponse<LongLivedAccessTokenData> = await this.axios.get(
        AUTH.FACEBOOK_GET_LONG_LIVED_ACCESS_TOKEN_URL(FACEBOOK_APP_GRAPH_API_VERSION),
        {
          params: {
            client_id: FACEBOOK_APP_CLIENT_ID,
            client_secret: FACEBOOK_APP_CLIENT_SECRET,
            grant_type: 'fb_exchange_token',
            fb_exchange_token: shortTermAccessToken,
          },
        },
      );

      const accessToken = accessTokenRequest.data['access_token'];

      const appSecretProof = crypto
        .createHmac('sha256', FACEBOOK_APP_CLIENT_SECRET)
        .update(accessToken)
        .digest('hex');

      const getUserRequest: AxiosResponse = await this.axios.get(AUTH.FACEBOOK_GET_USER_URL, {
        params: {
          fields: ['id', 'email', 'first_name', 'last_name'].join(','),
          // fields: ['id', 'email', 'first_name', 'last_name', 'profile_pic'].join(','),
          access_token: accessToken,
          appsecret_proof: appSecretProof,
        },
      });

      if (getUserRequest.status !== 200) {
        throw new ApplicationError(unauthorizedErrorPayload);
      }

      const user = getUserRequest.data;

      const getProfilePicRequest = await this.axios.get(AUTH.FACEBOOK_GET_USER_PICTURE(user.id), {
        params: {
          type: 'large',
          redirect: false,
        },
      });

      if (getProfilePicRequest.status !== 200) {
        throw new ApplicationError(unauthorizedErrorPayload);
      }

      const profilePic = getProfilePicRequest.data;

      return { ...user, ...profilePic };
    } catch (error) {
      throw new ApplicationError(unauthorizedErrorPayload);
    }
  }
}
