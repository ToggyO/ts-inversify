/**
 * Description: Application logger initialization.
 * Logger can be launched in development mode(logging to console) and production mode(logging to file).
 */

import * as express from 'express';
import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { ILogger, ILoggerService } from 'utils/logger';
import { STORAGE_KEYS } from 'constants/storage-keys';

@injectable()
export class CreateLogger implements ILoggerService {
  private logger: ILogger;

  constructor(@inject(TYPES.ILogger) logger: ILogger) {
    this.logger = logger;
  }

  public run(app: express.Application): void {
    this.logger.init();
    app.set(STORAGE_KEYS.LOGGER, this.logger);
  }

  public destroy(): void {}
}
