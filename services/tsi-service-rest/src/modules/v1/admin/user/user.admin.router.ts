/**
 * Description: Admin - User module router
 */

import express from 'express';
import { inject, injectable } from 'inversify';

import { BaseRouter } from 'modules/common';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { TYPES } from 'DIContainer/types';

import { IUserAdminHandler } from './user.admin.interfaces';

const { ADMIN } = SERVICE_ENDPOINTS;

@injectable()
export class UserAdminRouter extends BaseRouter {
  public readonly routePrefix = `${ADMIN.ROOT}${ADMIN.USERS.ROOT}`;

  constructor(@inject(TYPES.IUserAdminHandler) private readonly _controller: IUserAdminHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get users
     * @swagger
     * path:
     *  /api-rest/admin/users:
     *      get:
     *        tags:
     *          - Admin - Users
     *        description: Get list of users
     *        summary: Get list of users
     *        produces:
     *          - application/json
     *        parameters:
     *          - $ref: '#/components/schemas/paginationPage'
     *          - $ref: '#/components/schemas/paginationSize'
     *          - $ref: '#/components/schemas/sort'
     *          - in: query
     *            name: firstName
     *            description: Filter by `firstName` field.
     *            schema:
     *              type: string
     *          - in: query
     *            name: lastName
     *            description: Filter by `lastName` field.
     *            schema:
     *              type: string
     *          - in: query
     *            name: dobStartRange
     *            description: Filter by `dob` field Condition-`dob` must be greater or equal this parameter
     *            schema:
     *              type: string
     *          - in: query
     *            name: dobEndRange
     *            description: Filter by `dob` field. Condition-`dob` must be less or equal this parameter
     *            schema:
     *              type: string
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
     *                            $ref: '#/components/schemas/User'
     *                        pagination:
     *                          type: object
     *                          $ref: '#/components/schemas/paginationResponse'
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
      this.asyncWrapper(this._controller.getUsers),
    );

    /**
     * Get user by id
     * @swagger
     * path:
     *  /api-rest/admin/users/{id}:
     *      get:
     *        tags:
     *          - Admin - Users
     *        description: Get user by id
     *        summary: Get user by id
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
     *          404:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/notFoundResponse'
     */
    router.get(
      '/:userId',
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.getUser),
    );

    /**
     * Create user by admin
     * @swagger
     * path:
     *  /api-rest/admin/users:
     *      post:
     *        tags:
     *          - Admin - Users
     *        description: Create user by admin
     *        summary: Create user by admin
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/CreateUser'
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
    router.post(
      '/',
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.createUser),
    );

    /**
     * Update user by id
     * @swagger
     * path:
     *  /api-rest/admin/users/{id}:
     *      patch:
     *        tags:
     *          - Admin - Users
     *        description: Update user by id
     *        summary: Update user by id
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
     *          404:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/notFoundResponse'
     */
    router.patch(
      '/:userId',
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.updateUser),
    );

    /**
     * Change user's email
     * @swagger
     * path:
     *  /api-rest/admin/users/{id}/change-email:
     *      patch:
     *        tags:
     *          - Admin - Users
     *        description: Change user's email
     *        summary: Change user's email
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
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/ChangePasswordPayload'
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
     *          404:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/notFoundResponse'
     */
    router.patch(
      ADMIN.USERS.CHANGE_EMAIL,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.changeEmail),
    );

    /**
     * Toggle `isBlocked` field of the user
     * @swagger
     * path:
     *  /api-rest/admin/users/{id}/toggle-block:
     *      get:
     *        tags:
     *          - Admin - Users
     *        description: Toggle `isBlocked` field of the user
     *        summary: Toggle `isBlocked` field of the user
     *        produces:
     *          - application/json
     *        parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            required: true
     *          - $ref: '#/components/schemas/include'
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
     *          404:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/notFoundResponse'
     */
    router.get(
      ADMIN.USERS.TOGGLE_BLOCK,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.toggleUserBlock),
    );

    /**
     * Delete user by id
     * @swagger
     * path:
     *  /api-rest/admin/users/{id}:
     *      delete:
     *        tags:
     *          - Admin - Users
     *        description: Delete user by id
     *        summary: Delete user by id
     *        security:
     *          - ApiKeyAuth: []
     *        parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            required: true
     *        responses:
     *          200:
     *            description: Successful operation
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
    router.delete(
      `/:userId`,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorizeAdmin),
      this.asyncWrapper(this._controller.deleteUser),
    );

    return router;
  }
}
