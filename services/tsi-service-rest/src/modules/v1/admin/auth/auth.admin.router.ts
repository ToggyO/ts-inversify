/**
 * Description: Admin - Auth module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { IAuthHandler } from 'modules/v1/auth';

import { IAuthAdminHandler } from './auth.admin.interfaces';

const { ADMIN } = SERVICE_ENDPOINTS;

@injectable()
export class AuthAdminRouter extends BaseRouter {
  public readonly routePrefix = `${ADMIN.ROOT}${ADMIN.AUTH.ROOT}`;

  constructor(
    @inject(TYPES.IAuthAdminHandler) private readonly _adminAuthController: IAuthAdminHandler,
    @inject(TYPES.IAuthHandler) private readonly _authController: IAuthHandler,
  ) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Log in as admin
     * @swagger
     * path:
     *  /api-rest/admin/auth/login:
     *      post:
     *        tags:
     *          - Admin - Auth
     *        description: Log in as admin
     *        summary: Log in as admin
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/LoginPayload'
     *        responses:
     *          200:
     *            description: Successful operation
     *            headers:
     *              Identity:
     *                schema:
     *                  type: string
     *                  example: fd4698c940c6d1da602a70ac34f0b147
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
     */
    router.post(ADMIN.AUTH.LOGIN, this.asyncWrapper(this._adminAuthController.login));

    /**
     * Send request on password restore
     * @swagger
     * path:
     *  /api-rest/admin/auth/restore-password:
     *      post:
     *        tags:
     *          - Admin - Auth
     *        description: Send request on password restore
     *        summary: Send request on password restore
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                  email:
     *                    type: string
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
     *                  resultData:
     *                    type: object
     *                    $ref: '#/components/schemas/RestorePasswordDTO'
     *          400:
     *            description: Bad parameters
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/incorrectParamsResponse'
     */
    router.post(ADMIN.AUTH.RESTORE_PASSWORD, this.asyncWrapper(this._adminAuthController.restorePassword));

    /**
     * Reset admin password by token
     * @swagger
     * path:
     *  /api-rest/admin/auth/reset-password:
     *      patch:
     *        tags:
     *          - Admin - Auth
     *        description: Reset admin password by token
     *        summary: Reset admin password by token
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/ResetPasswordDTO'
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
     */
    router.patch(ADMIN.AUTH.RESET_PASSWORD, this.asyncWrapper(this._adminAuthController.resetPassword));

    /**
     * Log out as admin
     * @swagger
     * path:
     *  /api-rest/admin/auth/logout:
     *      get:
     *        tags:
     *          - Admin - Auth
     *        description: Log out as admin
     *        summary: Log out as admin
     *        security:
     *          - ApiKeyAuth: []
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
    router.get(
      ADMIN.AUTH.LOGOUT,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._authController.logout),
    );

    return router;
  }
}
