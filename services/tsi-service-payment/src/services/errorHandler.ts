/**
 * Description: Application root request errors handler
 */

import * as express from 'express';
import { injectable } from 'inversify';

import { IApplicationError, IService } from 'interfaces';
import { ERROR_CODES } from 'constants/error-codes';
import { STORAGE_KEYS } from 'constants/storage-keys';

@injectable()
export class ErrorHandler implements IService {
  public run(app: express.Application): void {
    app.use(
      (
        err: IApplicationError,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ): void => {
        if (!err.errorCode) {
          app.get(STORAGE_KEYS.LOGGER).error(err);
        }

        if (err.statusCode && err.errorMessage) {
          const { statusCode, errorCode, errorMessage, errors = [] } = err;
          res.status(statusCode).send({
            errorCode,
            errorMessage,
            errors,
          });
          return;
        }

        res.status(err.statusCode || ERROR_CODES.internal_server_error).send({
          errorCode: err.errorCode || ERROR_CODES.internal_server_error,
          errorMessage:
            err.errorCode && err.errorCode !== ERROR_CODES.internal_server_error
              ? err.errorMessage
              : `Internal server error: ${err.errorMessage || err.message}`,
          errors: err.errors || [],
        });
      },
    );
  }

  public destroy(): void {}
}
