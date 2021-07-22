/**
 * Description: Root application file
 */

import 'reflect-metadata';
import 'module-alias/register';

import { TYPES } from 'DIContainer';
import { IConfiguration } from 'config';

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
  const host = configService.get<string>('TSI_PAYMENT_HOST', '0.0.0.0');
  const port = configService.get<number>('TSI_PAYMENT_PORT', 5004);

  application.listen({ host, port });

  return application;
})();
