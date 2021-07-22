/**
 * Description: Admin - Users module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';

import { IUserAdminHandler } from './user.admin.interfaces';

@injectable()
export class UserAdminRouter extends BaseRouter {
  public readonly routePrefix = '/admin/users';

  constructor(@inject(TYPES.IUserAdminHandler) private readonly _controller: IUserAdminHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Create user by administrator
     */
    router.post('/', this.asyncWrapper(this._controller.createUser));

    /**
     * Change user's email
     */
    router.patch('/change-email', this.asyncWrapper(this._controller.changeEmail));

    /**
     * Block/Unblock user
     */
    router.get('/:userId/toggle-block', this.asyncWrapper(this._controller.toggleUserBlock));

    return router;
  }
}
