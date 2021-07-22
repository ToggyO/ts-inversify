/**
 * Description: Modules service configuration
 */

import * as express from 'express';
import swaggerUi from 'swagger-ui-express';
import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { IModule, IModuleService } from 'modules/interfaces';
import { TYPES } from 'DIContainer/types';
import { API_URL_PREFIX } from 'constants/common';
import { ILogger } from 'utils/logger';

@injectable()
export class Modules implements IModuleService {
  readonly modules: IModule;

  constructor(
    @inject(TYPES.IConfiguration) private readonly _configService: IConfiguration,
    @inject(TYPES.ILogger) private readonly _logger: ILogger,
    @inject(TYPES.IModule) modules: IModule,
  ) {
    this.modules = modules;
  }

  public run(app: express.Application): void {
    const { modules, _configService } = this;
    const ROUTE_PREFIX = _configService.get<string>('ROUTE_PREFIX', '');

    app.use(ROUTE_PREFIX, modules.createRouter());
    if (!this._configService.isProduction) {
      app.use(API_URL_PREFIX, swaggerUi.serve, modules.initializeSwagger('/'));
      const host = this._configService.get<string>('TSI_REST_HOST');
      const port = this._configService.get<number>('TSI_REST_PORT');
      this._logger.info(`Swagger: http://${host}:${port}${API_URL_PREFIX}`);
    }
  }

  public destroy(): void {}
}
