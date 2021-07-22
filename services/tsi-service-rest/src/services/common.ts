/**
 * Description: Base web-server configuration settings.
 */

import * as express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { injectable } from 'inversify';

import { IService } from 'interfaces';
import { STORAGE_KEYS } from 'constants/storage-keys';

@injectable()
export class ServerSettings implements IService {
  public run(app: express.Application): void {
    app.disable('x-powered-by');
    // Request data parsing
    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));
    // TODO: delete in PROD
    app.use(compression());
    // Unhandled errors handler
    this.unhandledRejection(app);
  }

  private unhandledRejection(app: express.Application): void {
    const log = app.get(STORAGE_KEYS.LOGGER);
    const unhandledRejections: any[] = [];

    process.on('unhandledRejection', (reason: { [key: string]: any }, promise) => {
      const errorMsgContent = `${reason?.stack || reason}`;
      const errorMsg = errorMsgContent.replace(/(\r\n|\n|\r)|(\s{2,})/gm, ' ');
      log.warn(errorMsg);
      unhandledRejections.push(promise); // or Promise.reject(new Error())
    });

    process.on('rejectionHandled', (promise) => {
      const index = unhandledRejections.indexOf(promise);
      unhandledRejections.splice(index, 1);
    });
  }

  public destroy(): void {}
}
