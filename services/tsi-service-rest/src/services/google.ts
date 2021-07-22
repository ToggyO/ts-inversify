/**
 * Description: Google auth service configuration
 */

import * as express from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IGoogleAuthService, IGoogleClient } from 'utils/googleClient';

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  public readonly googleClient: IGoogleClient;

  constructor(@inject(TYPES.IGoogleClient) googleClient: IGoogleClient) {
    this.googleClient = googleClient;
  }

  public run(app: express.Application): void {
    this.googleClient.init();
  }

  public destroy(): void {}
}
