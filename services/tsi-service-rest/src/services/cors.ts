/**
 * Description: Cors service configuration
 */

import * as express from 'express';
import cors from 'cors';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IConfiguration } from 'config';
import { ICorsService } from 'interfaces';
import { ApplicationError } from 'utils/response';
import { ERROR_CODES } from 'constants/error-codes';
import { ILogger } from 'utils/logger';
import { STORAGE_KEYS } from 'constants/storage-keys';

@injectable()
export class CorsService implements ICorsService {
  constructor(@inject(TYPES.IConfiguration) private readonly configService: IConfiguration) {}

  public run(app: express.Application): void {
    const logger: ILogger = app.get(STORAGE_KEYS.LOGGER);
    const whitelist = this.getWhiteList(logger);
    const isProd = this.configService.isProduction;
    const identityHeader = this.configService.get<string>('IDENTITY_HEADER', '');

    app.use(
      cors({
        origin: function (origin, callback) {
          if (!isProd) {
            return callback(null, true);
          }

          const parsedOrigin = origin || '';
          if (whitelist.indexOf(parsedOrigin) !== -1 || !parsedOrigin) {
            callback(null, true);
          } else {
            callback(
              new ApplicationError({
                statusCode: 401,
                errorCode: ERROR_CODES.conflict,
                errorMessage: 'Not allowed by CORS',
                errors: [identityHeader],
              }),
            );
          }
        },
        credentials: true,
        exposedHeaders: ['Identity'],
      }),
    );
  }

  public destroy(): void {}

  protected getWhiteList(logger: ILogger): Array<string> {
    let whitelist: Array<string>;
    // const DEBUG = this.configService.get<string>('DEBUG');
    const CORS_WHITE_LIST = this.configService.get<Array<string>>('CORS_WHITE_LIST', []);

    try {
      // whitelist = DEBUG ? JSON.parse(CORS_WHITE_LIST) : CORS_WHITE_LIST;
      whitelist = CORS_WHITE_LIST;
    } catch (error) {
      logger.error(error);
      whitelist = [];
    }

    return whitelist;
  }
}
