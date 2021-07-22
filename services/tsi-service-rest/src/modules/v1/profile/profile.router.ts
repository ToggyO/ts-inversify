/**
 * Description: User profile module router
 */

import express from 'express';
import { Multer } from 'multer';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { TYPES } from 'DIContainer/types';
import { IFileHandler } from 'utils/fileHandle';
import { UserStatus } from 'constants/user-statuses';
import { PROFILE_IMAGE_FIELD_NAME } from 'constants/file-upload';

import { IProfileHandler } from './interfaces';

const { PROFILE } = SERVICE_ENDPOINTS;

@injectable()
export class ProfileRouter extends BaseRouter {
  public readonly routePrefix = PROFILE.ROOT;

  constructor(
    @inject(TYPES.IProfileHandler) protected readonly ProfileController: IProfileHandler,
    @inject(TYPES.IFileHandler) protected readonly fileHandler: IFileHandler<Multer>,
  ) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get current authenticated user profile
     * @swagger
     * path:
     *  /api-rest/profile:
     *      get:
     *        tags:
     *          - Profile
     *        description: Get current authenticated user profile
     *        summary: Get current authenticated user profile
     *        security:
     *          - ApiKeyAuth: []
     *        produces:
     *          - application/json
     *        responses:
     *          200:
     *            description: Successful operation
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    errorCode:
     *                      type: number
     *                      example: 0
     *                    resultData:
     *                      type: object
     *                      $ref: '#/components/schemas/User'
     *          401:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/unauthorizedResponse'
     *          403:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/forbiddenResponse'
     */
    router.get(
      '/',
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.ProfileController.getProfile),
    );

    /**
     * Update current authenticated user profile
     * @swagger
     * path:
     *  /api-rest/profile:
     *      patch:
     *        tags:
     *          - Profile
     *        description: Update current authenticated user profile
     *        summary: Update current authenticated user profile
     *        security:
     *          - ApiKeyAuth: []
     *        produces:
     *          - application/json
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/UpdateUser'
     *        responses:
     *          200:
     *            description: Successful operation
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    errorCode:
     *                      type: number
     *                      example: 0
     *                    resultData:
     *                      type: object
     *                      $ref: '#/components/schemas/User'
     *          400:
     *            description: Bad parameters
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/incorrectParamsResponse'
     *          401:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/unauthorizedResponse'
     *          403:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/forbiddenResponse'
     */
    router.patch(
      '/',
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.ProfileController.updateProfile),
    );

    /**
     * Set new password for current authenticated user
     * @swagger
     * path:
     *  /api-rest/profile/change-password:
     *      patch:
     *        tags:
     *          - Profile
     *        description: Set new password for current authenticated user
     *        summary: Set new password for current authenticated user
     *        security:
     *          - ApiKeyAuth: []
     *        produces:
     *          - application/json
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/ChangePassword'
     *        responses:
     *          200:
     *            description: Successful operation
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    errorCode:
     *                      type: number
     *                      example: 0
     *                    resultData:
     *                      type: object
     *          400:
     *            description: Bad parameters
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/incorrectParamsResponse'
     *          401:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/unauthorizedResponse'
     *          403:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/forbiddenResponse'
     */
    router.patch(
      PROFILE.CHANGE_PASSWORD,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.ProfileController.changePassword),
    );

    /**
     * Update user profile image
     * @swagger
     * path:
     *  /api-rest/profile/image:
     *      patch:
     *        tags:
     *          - Profile
     *        description: Update user profile image
     *        summary: Update user profile image
     *        security:
     *          - ApiKeyAuth: []
     *        produces:
     *          - application/json
     *        requestBody:
     *          content:
     *            multipart/form-data:
     *              schema:
     *                type: object
     *                properties:
     *                  profileImage:
     *                    type: string
     *                    format: binary
     *        responses:
     *          200:
     *            description: Successful operation
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    errorCode:
     *                      type: number
     *                      example: 0
     *                    resultData:
     *                      type: object
     *          400:
     *            description: Bad parameters
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/incorrectParamsResponse'
     *          401:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/unauthorizedResponse'
     *          403:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/forbiddenResponse'
     */
    router.patch(
      PROFILE.PROFILE_IMAGE,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.fileHandler.uploadSingle(PROFILE_IMAGE_FIELD_NAME)),
      this.asyncWrapper(this.ProfileController.updateProfilePic),
    );

    /**
     * Get favourite products of user
     * @swagger
     * path:
     *  /api-rest/profile/favourites:
     *      get:
     *        tags:
     *          - Profile
     *        description: Get favourite products of user
     *        summary: Get favourite products of user
     *        security:
     *          - ApiKeyAuth: []
     *        produces:
     *          - application/json
     *        parameters:
     *          - $ref: '#/components/schemas/paginationPage'
     *          - $ref: '#/components/schemas/paginationSize'
     *        responses:
     *          200:
     *            description: Successful operation
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    errorCode:
     *                      type: number
     *                      example: 0
     *                    resultData:
     *                      type: object
     *                      properties:
     *                        items:
     *                          type: array
     *                          items:
     *                            $ref: '#/components/schemas/Product'
     *          401:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/unauthorizedResponse'
     *          403:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/forbiddenResponse'
     */
    router.get(
      PROFILE.FAVOURITES,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.ProfileController.getFavouriteProducts),
    );

    /**
     * Add product to user's favourites by id
     * @swagger
     * path:
     *  /api-rest/profile/favourites:
     *      patch:
     *        tags:
     *          - Profile
     *        description: Add product to user's favourites by id
     *        summary: Add product to user's favourites by id
     *        security:
     *          - ApiKeyAuth: []
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            required: true
     *          - in: query
     *            name: action
     *            schema:
     *              type: string
     *              enum:
     *                - add
     *                - remove
     *              required: true
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  productId:
     *                    type: number
     *        responses:
     *          200:
     *            description: Successful operation
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    errorCode:
     *                      type: number
     *                      example: 0
     *                    resultData:
     *                      type: object
     *                      $ref: '#/components/schemas/User'
     *          400:
     *            description: Bad parameters
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/incorrectParamsResponse'
     *          401:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/unauthorizedResponse'
     *          403:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/forbiddenResponse'
     *          404:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/notFoundResponse'
     */
    router.patch(
      PROFILE.FAVOURITES,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.ProfileController.favouriteProducts),
    );

    /**
     * Get list of bookings of user
     * @swagger
     * path:
     *  /api-rest/profile/bookings:
     *      get:
     *        tags:
     *          - Profile
     *        description: Get list of bookings of user
     *        summary: Get list of bookings of user
     *        security:
     *          - ApiKeyAuth: []
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: query
     *            name: onlyActiveBookings
     *            schema:
     *              type: boolean
     *          - $ref: '#/components/schemas/paginationPage'
     *          - $ref: '#/components/schemas/paginationSize'
     *        responses:
     *          200:
     *            description: Successful operation
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    errorCode:
     *                      type: number
     *                      example: 0
     *                    resultData:
     *                      type: object
     *                      properties:
     *                        items:
     *                          type: array
     *                          items:
     *                            $ref: '#/components/schemas/BookingOfUserDTO'
     *          401:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/unauthorizedResponse'
     *          403:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/forbiddenResponse'
     */
    router.get(
      PROFILE.GET_BOOKINGS,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.ProfileController.getListOfBookings),
    );

    return router;
  }
}
