/**
 * Description: Session service configuration
 */

import * as express from 'express';
import { injectable, inject } from 'inversify';

import { ISessionService } from 'interfaces';
import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { IIdentityHelpers } from 'utils/authentication';

@injectable()
export class SessionService implements ISessionService {
  constructor(
    @inject(TYPES.IConfiguration) private readonly configService: IConfiguration,
    @inject(TYPES.IIdentityHelpers) private readonly _identityHelpers: IIdentityHelpers,
  ) {}

  public run(app: express.Application): void {
    app.set('trust proxy', 1);
    app.use(this._identityHelpers.sessionChecker);
  }

  public destroy(): void {}
}
