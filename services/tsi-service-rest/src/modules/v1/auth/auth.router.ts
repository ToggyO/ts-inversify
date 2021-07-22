/**
 * Description: Auth module router
 */

import express from 'express';
import { inject, injectable } from 'inversify';

import { BaseRouter } from 'modules/common';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { UserStatus } from 'constants/user-statuses';
import { TYPES } from 'DIContainer/types';

import { IAuthHandler } from '../auth/types';

const { AUTH } = SERVICE_ENDPOINTS;

@injectable()
export class AuthRouter extends BaseRouter {
  public readonly routePrefix = AUTH.ROOT;

  constructor(@inject(TYPES.IAuthHandler) protected readonly AuthController: IAuthHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Log in as user by email
     * @swagger
     * path:
     *  /api-rest/auth/login-email:
     *      post:
     *        tags:
     *          - Auth
     *        description: Log in as user by email
     *        summary: Log in as user by email
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
     *                      $ref: '#/components/schemas/User'
     *          400:
     *            description: Bad parameters
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/incorrectParamsResponse'
     */
    router.post(AUTH.LOGIN_WITH_EMAIL, this.asyncWrapper(this.AuthController.loginWithEmail));

    /**
     * Log in as user by google
     * @swagger
     * path:
     *  /api-rest/auth/login-google:
     *      post:
     *        tags:
     *          - Auth
     *        description: Log in as user by google
     *        summary: Log in as user by google
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/LoginWithGooglePayload'
     *        responses:
     *          200:
     *            description: Successful operation
     *            headers:
     *              Set-Cookie:
     *                schema:
     *                  type: string
     *                  example: connect.sid=fd4698c940c6d1da602a70ac34f0b147; Path=/; HttpOnly
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
     */
    router.post(AUTH.LOGIN_WITH_GOOGLE, this.asyncWrapper(this.AuthController.loginWithGoogle));

    /**
     * Log in as user by facebook
     * @swagger
     * path:
     *  /api-rest/auth/login-facebook:
     *      post:
     *        tags:
     *          - Auth
     *        description: Log in as user by facebook
     *        summary: Log in as user by facebook
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/LoginWithFacebookPayload'
     *        responses:
     *          200:
     *            description: Successful operation
     *            headers:
     *              Set-Cookie:
     *                schema:
     *                  type: string
     *                  example: connect.sid=fd4698c940c6d1da602a70ac34f0b147; Path=/; HttpOnly
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
     */
    router.post(AUTH.LOGIN_WITH_FACEBOOK, this.asyncWrapper(this.AuthController.loginWithFacebook));

    /**
     * Register user
     * @swagger
     * path:
     *  /api-rest/auth/registration:
     *      post:
     *        tags:
     *          - Auth
     *        description: Register user
     *        summary: Register user
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                allOf:
     *                  - $ref: '#/components/schemas/CreateUser'
     *                  - $ref: '#/components/schemas/CreateUserWithPassword'
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
    router.post(AUTH.REGISTRATION, this.asyncWrapper(this.AuthController.registration));

    /**
     * Verify new user email
     * @swagger
     * path:
     *  /api-rest/auth/verify-email:
     *      post:
     *        tags:
     *          - Auth
     *        description: Verify new user email
     *        summary: Verify new user email
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/VerifyEmailCode'
     *        responses:
     *          201:
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
    router.post(AUTH.VERIFY_EMAIL, this.asyncWrapper(this.AuthController.verifyEmail));

    /**
     * Verify user email after login
     * @swagger
     * path:
     *  /api-rest/auth/verify-email-with-auth:
     *      post:
     *        tags:
     *          - Auth
     *        description: Verify user email after login
     *        summary: Verify user email after login
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/VerifyEmailCodeWithAuth'
     *        responses:
     *          201:
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
    router.post(
      AUTH.VERIFY_EMAIL_WITH_AUTH,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Inactive])),
      this.asyncWrapper(this.AuthController.verifyEmailWithAuth),
    );

    /**
     * Send new otp code to email
     * @swagger
     * path:
     *  /api-rest/auth/send-new-otp:
     *      post:
     *        tags:
     *          - Auth
     *        description: Send new otp code to email
     *        summary: Send new otp code to email
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/SendNewOtp'
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
     */
    router.post(AUTH.SEND_NEW_OTP, this.asyncWrapper(this.AuthController.sendNewOtp));

    /**
     * Send request on password restore
     * @swagger
     * path:
     *  /api-rest/auth/restore-password:
     *      post:
     *        tags:
     *          - Auth
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
    router.post(AUTH.RESTORE_PASSWORD, this.asyncWrapper(this.AuthController.restorePassword));

    /**
     * Reset user's password by token
     * @swagger
     * path:
     *  /api-rest/auth/reset-password:
     *      post:
     *        tags:
     *          - Auth
     *        description: Reset user's password by token
     *        summary: Reset user's password by token
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
    router.post(AUTH.RESET_PASSWORD, this.asyncWrapper(this.AuthController.resetPassword));

    /**
     * Log out
     * @swagger
     * path:
     *  /api-rest/auth/logout:
     *      get:
     *        tags:
     *          - Auth
     *        description: Log out
     *        summary: Log out
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
     *          404:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/notFoundResponse'
     */
    router.get(
      AUTH.LOGOUT,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Inactive, UserStatus.Active])),
      this.asyncWrapper(this.AuthController.logout),
    );

    return router;
  }
}
