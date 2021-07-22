/**
 * Description: Admin - Profile module router
 */

import express from 'express';
import { Multer } from 'multer';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';

import { IProfileAdminHandler } from './profile.admin.interfaces';
import { PROFILE_IMAGE_FIELD_NAME } from 'constants/file-upload';
import { IFileHandler } from 'utils/fileHandle';

const { ADMIN } = SERVICE_ENDPOINTS;

@injectable()
export class ProfileAdminRouter extends BaseRouter {
  public readonly routePrefix = `${ADMIN.ROOT}${ADMIN.PROFILE.ROOT}`;

  constructor(
    @inject(TYPES.IProfileAdminHandler) private readonly _controller: IProfileAdminHandler,
    @inject(TYPES.IFileHandler) private readonly _fileHandler: IFileHandler<Multer>,
  ) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get current authenticated admin profile
     * @swagger
     * path:
     *  /api-rest/admin/profile:
     *      get:
     *        tags:
     *          - Admin - Profile
     *        description: Get current authenticated admin profile
     *        summary: Get current authenticated admin profile
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
     *                      $ref: '#/components/schemas/Admin'
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
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.getProfile),
    );

    /**
     * Update current authenticated admin profile
     * @swagger
     * path:
     *  /api-rest/admin/profile:
     *      put:
     *        tags:
     *          - Admin - Profile
     *        description: Update current authenticated admin profile
     *        summary: Update current authenticated admin profile
     *        security:
     *          - ApiKeyAuth: []
     *        produces:
     *          - application/json
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/UpdateAdminDTO'
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
     *                      $ref: '#/components/schemas/Admin'
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
    router.put(
      '/',
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.updateProfile),
    );

    /**
     * Set new password for current authenticated admin
     * @swagger
     * path:
     *  /api-rest/admin/profile/change-password:
     *      patch:
     *        tags:
     *          - Admin - Profile
     *        description: Set new password for current authenticated admin
     *        summary: Set new password for current authenticated admin
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
      ADMIN.PROFILE.CHANGE_PASSWORD,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.changePassword),
    );

    /**
     * Update admin profile image
     * @swagger
     * path:
     *  /api-rest/admin/profile/image:
     *      patch:
     *        tags:
     *          - Admin - Profile
     *        description: Update admin profile image
     *        summary: Update admin profile image
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
     *                      $ref: '#/components/schemas/Admin'
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
      ADMIN.PROFILE.PROFILE_IMAGE,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._fileHandler.uploadSingle(PROFILE_IMAGE_FIELD_NAME)),
      this.asyncWrapper(this._controller.updateProfilePic),
    );

    return router;
  }
}
