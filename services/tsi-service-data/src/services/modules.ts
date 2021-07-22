/**
 * Description: Modules service
 */

import * as express from 'express';
import { injectable, inject } from 'inversify';

import { IDbContext } from 'db/interfaces';
import { IModule, IModuleService } from 'modules/interfaces';
import { TYPES } from 'DIContainer/types';

@injectable()
export class Modules implements IModuleService {
  public readonly modules: IModule;
  public readonly dbContext: IDbContext;

  constructor(@inject(TYPES.IModule) modules: IModule, @inject(TYPES.DbContext) dbContext: IDbContext) {
    this.modules = modules;
    this.dbContext = dbContext;
  }

  public run(app: express.Application): void {
    const { modules, dbContext } = this;
    dbContext.initializeModels(app);
    app.use('/', modules.createRouter());
  }

  public destroy(): void {}
}
