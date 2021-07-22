/**
 * Description: Mail service configuration
 */

import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { IApplicationStorage, IService } from 'interfaces';
import { IMailer, MailerConfiguration } from 'utils/mailer';
import { TYPES } from 'DIContainer/types';

@injectable()
export class MailService implements IService {
  private readonly _options: MailerConfiguration;

  constructor(
    @inject(TYPES.IConfiguration) private readonly _configService: IConfiguration,
    @inject(TYPES.IMailer) private readonly _mailer: IMailer,
  ) {
    const MAIL_HOST = _configService.get<string>('MAIL_HOST');
    const MAIL_PORT = _configService.get<string>('MAIL_PORT', '');
    const MAIL_USERNAME = _configService.get<string>('MAIL_USERNAME', '');
    const MAIL_PASSWORD = _configService.get<string>('MAIL_PASSWORD', '');
    const MAIL_FROM_NAME = _configService.get<string>('MAIL_FROM_NAME', '');
    const MAIL_FROM_ADDRESS = _configService.get<string>('MAIL_FROM_ADDRESS', '');
    const API_DOMAIN = _configService.get<string>('API_DOMAIN', '');
    const SUPPORT_MAIL = _configService.get<string>('SUPPORT_EMAIL_CONTACT_US', '');

    this._options = {
      connectionOptions: {
        host: MAIL_HOST,
        port: parseInt(MAIL_PORT),
        auth: {
          user: MAIL_USERNAME,
          pass: MAIL_PASSWORD,
        },
      },
      messageOptions: {
        from: {
          name: MAIL_FROM_NAME,
          address: MAIL_FROM_ADDRESS,
        },
      },
      appDomain: API_DOMAIN,
      supportMail: SUPPORT_MAIL,
    };
  }

  public run(appStorage: IApplicationStorage): void {
    this._mailer.init(this._options);
  }

  public destroy(): void {}
}
