/**
 * Description: Global initialization of the 1st version of API
 */

import { Router } from 'express';
import { injectable, multiInject } from 'inversify';

import { IBaseRouter } from 'modules/interfaces';
import { TYPES } from 'DIContainer/types';

import { Module } from '../common';

@injectable()
export class ModuleV1 extends Module {
  readonly routerCollection: IBaseRouter[];

  constructor(@multiInject(TYPES.IBaseRouter) routers: IBaseRouter[]) {
    super();
    this.routerCollection = routers;
  }

  /**
   * Initializing routing
   */
  public createRouter(): Router {
    this.routerCollection.forEach((router: IBaseRouter) => {
      this.router.use(router.routePrefix, router.initRoutes());
    });

    return this.router;
  }

  public initializeModels(): void {}

  public initializeSwagger(): void {}
}
