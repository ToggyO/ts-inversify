/**
 * Description: Admin - Auth module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';

import { IAuthAdminHandler } from './admin-user.admin.interfaces';

@injectable()
export class AdminUserAdminRouter extends BaseRouter {
  public readonly routePrefix = '/admin/admin-user';

  constructor(@inject(TYPES.IAuthAdminHandler) private readonly _controller: IAuthAdminHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get admin by id
     */
    router.get('/:id', this.asyncWrapper(this._controller.getAdminById));

    /**
     * Check admin login credentials
     */
    router.post('/check-credentials', this.asyncWrapper(this._controller.checkLoginCredentials));

    /**
     * Get restore password token
     */
    router.patch('/restore-password', this.asyncWrapper(this._controller.restorePassword));

    /**
     * Reset admin password by special token
     */
    router.patch('/reset-password', this.asyncWrapper(this._controller.resetPassword));

    /**
     * Update admin
     */
    router.put('/:id', this.asyncWrapper(this._controller.updateAdmin));

    /**
     * Change admin password
     */
    router.patch('/change-password', this.asyncWrapper(this._controller.changePassword));

    /**
     * Update `profile_image` field of admin by id
     */
    router.patch('/:id/profile-image', this.asyncWrapper(this._controller.updateProfileImage));

    return router;
  }
}
