/**
 * Description: Base web-server configuration settings.
 */

import { injectable } from 'inversify';

import { IService, IApplicationStorage } from 'interfaces';
import { ILogger } from 'utils/logger';
import { STORAGE_KEYS } from 'constants/storage-keys';

@injectable()
export class ServerSettings implements IService {
  public run(appStorage: IApplicationStorage): void {
    this.unhandledRejection(appStorage);
  }

  private unhandledRejection(appStorage: IApplicationStorage): void {
    const log = appStorage.get<ILogger>(STORAGE_KEYS.LOGGER);
    const unhandledRejections: any[] = [];

    process.on('unhandledRejection', (reason: { [key: string]: any }, promise) => {
      const errorMsgContent = `${reason?.stack || reason}`;
      const errorMsg = errorMsgContent.replace(/(\r\n|\n|\r)|(\s{2,})/gm, ' ');

      if (log) {
        log.warn(errorMsg);
      }

      unhandledRejections.push(promise); // or Promise.reject(new Error())
    });

    process.on('rejectionHandled', (promise) => {
      const index = unhandledRejections.indexOf(promise);
      unhandledRejections.splice(index, 1);
    });
  }

  public destroy(): void {}
}
