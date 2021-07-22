/**
 * Description: Modules service configuration
 */

import * as express from 'express';
import { injectable, inject } from 'inversify';

import { IModule, IModuleService } from 'modules/interfaces';
import { TYPES } from 'DIContainer/types';

@injectable()
export class Modules implements IModuleService {
  readonly modules: IModule;

  constructor(@inject(TYPES.IModule) modules: IModule) {
    this.modules = modules;
  }

  public run(app: express.Application): void {
    const { modules } = this;
    app.use('/', modules.createRouter());
  }

  public destroy(): void {}
}
