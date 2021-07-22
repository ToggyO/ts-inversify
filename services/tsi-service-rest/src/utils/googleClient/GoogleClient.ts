/**
 * Description: Class described work with Google Auth API
 */

import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { ApplicationError } from 'utils/response';
import { ERROR_CODES } from 'constants/error-codes';

import { IGoogleClient } from './types';

@injectable()
export class GoogleClient implements IGoogleClient {
  private client: OAuth2Client | null = null;

  constructor(@inject(TYPES.IConfiguration) protected readonly configService: IConfiguration) {}

  public init(): void {
    const GOOGLE_APP_CLIENT_ID = this.configService.get<string>('GOOGLE_APP_CLIENT_ID', '');
    const GOOGLE_APP_CLIENT_SECRET = this.configService.get<string>('GOOGLE_APP_CLIENT_SECRET', '');

    this.client = new OAuth2Client({
      clientId: GOOGLE_APP_CLIENT_ID,
      clientSecret: GOOGLE_APP_CLIENT_SECRET,
    });
  }

  public async googleAuth(idToken: string): Promise<TokenPayload | undefined> {
    if (!this.client) {
      this.init();
    }

    try {
      const ticket = await this.client!.verifyIdToken({ idToken });
      return ticket.getPayload();
    } catch (error) {
      throw new ApplicationError({
        statusCode: 401,
        errorCode: ERROR_CODES.authorization__invalid_credentials_error,
        errorMessage: 'Token is invalid',
        errors: [],
      });
    }
  }

  get Client(): OAuth2Client | null {
    return this.client;
  }
}
