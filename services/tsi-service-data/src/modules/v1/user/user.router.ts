/**
 * Description: Users module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';

import { IUserHandler } from './interfaces';

/**
 * Router: Users
 */
@injectable()
export class UserRouter extends BaseRouter {
  public readonly routePrefix = '/users';

  constructor(@inject(TYPES.IUserHandler) protected readonly userController: IUserHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get list of users
     */
    router.get('/', this.asyncWrapper(this.userController.getUsers));

    /**
     * Create user
     */
    router.post('/create', this.asyncWrapper(this.userController.createUser));

    /**
     * Verify email by otp code
     */
    router.post('/check-otp', this.asyncWrapper(this.userController.checkOtpCode));

    /**
     * Check user's login credentials
     */
    router.post('/check-credentials', this.asyncWrapper(this.userController.checkLoginCredentials));

    /**
     * Send new otp code to email
     */
    router.post('/send-new-otp', this.asyncWrapper(this.userController.sendNewOtp));

    /**
     * Change user's password
     */
    router.patch('/change-password', this.asyncWrapper(this.userController.changePassword));

    /**
     * Get restore password token
     */
    router.post('/restore-password', this.asyncWrapper(this.userController.restorePassword));

    /**
     * Reset user's password by special token
     */
    router.patch('/reset-password', this.asyncWrapper(this.userController.resetPassword));

    /**
     * Update `stripe_customer_token` field of user by user id
     */
    router.patch('/:id/customer_token', this.asyncWrapper(this.userController.updateStripeCustomerToken));

    /**
     * Update `profile_image` field of user by user id
     */
    router.patch('/:id/profile-image', this.asyncWrapper(this.userController.updateProfileImage));

    /**
     * Get favourite products of user
     */
    router.get('/:id/favourites', this.asyncWrapper(this.userController.getFavouriteProducts));

    /**
     * Get user by id
     */
    router.get('/:id', this.asyncWrapper(this.userController.getUserById));

    /**
     * Update user info by id
     */
    router.patch('/:id', this.asyncWrapper(this.userController.updateUser));

    /**
     * Add product to user's favourites by id
     */
    router.patch('/:id/favourites', this.asyncWrapper(this.userController.favouriteProducts));

    /**
     * Delete user by id (DEV)
     */
    router.delete('/:id', this.asyncWrapper(this.userController.deleteUser));

    return this.router;
  }
}
