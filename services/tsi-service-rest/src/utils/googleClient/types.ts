/**
 * Description: Types and interfaces for Google API client
 */

import { OAuth2Client, TokenPayload } from 'google-auth-library';

import { IService } from 'interfaces';

export interface IGoogleClient {
  readonly Client: OAuth2Client | null;
  init(): void;
  googleAuth(idToken: string): Promise<TokenPayload | undefined>;
}

export interface IGoogleAuthService extends IService {
  readonly googleClient: IGoogleClient;
}
