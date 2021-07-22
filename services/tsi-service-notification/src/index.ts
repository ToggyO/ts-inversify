/**
 * Description: Root application file
 */

import 'reflect-metadata';
import 'module-alias/register';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer';

import { Application } from './app';

(async (): Promise<Application> => {
  const application = new Application();

  try {
    await application.runServices();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  const configService = application.get<IConfiguration>(TYPES.IConfiguration);
  const host = configService.get<string>('TSI_NOTIFICATION_HOST', '0.0.0.0');
  const port = configService.get<number>('TSI_NOTIFICATION_PORT', 5002);

  application.listen({ host, port });

  return application;
})();
