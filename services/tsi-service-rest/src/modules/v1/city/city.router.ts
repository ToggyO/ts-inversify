/**
 * Description: Cities module router
 */

import express from 'express';
import { inject, injectable } from 'inversify';

import { BaseRouter } from 'modules/common';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { UserStatus } from 'constants/user-statuses';
import { TYPES } from 'DIContainer/types';

import { ICityHandler } from './types';

const { CITIES } = SERVICE_ENDPOINTS;

@injectable()
export class CityRouter extends BaseRouter {
  public readonly routePrefix = CITIES.ROOT;

  constructor(@inject(TYPES.ICityHandler) protected readonly CityController: ICityHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get cities
     * @swagger
     * path:
     *  /api-rest/cities:
     *      get:
     *        tags:
     *          - Cities
     *        description: Get list of cities
     *        summary: Get list of cities
     *        produces:
     *          - application/json
     *        parameters:
     *          - $ref: '#/components/schemas/paginationPage'
     *          - $ref: '#/components/schemas/paginationSize'
     *          - $ref: '#/components/schemas/sort'
     *          - in: query
     *            name: search
     *            description: Search for cities by `name` field
     *            schema:
     *              type: string
     *          - in: query
     *            name: withTopDestination
     *            description: Get cities where `topDestination` field equals `true`
     *            schema:
     *              type: boolean
     *          - in: query
     *            name: withTopToVisit
     *            description: Get cities where `topToVisit` field equals `true`
     *            schema:
     *              type: boolean
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
     *                            $ref: '#/components/schemas/City'
     *                        pagination:
     *                          type: object
     *                          $ref: '#/components/schemas/paginationResponse'
     */
    router.get('/', this.asyncWrapper(this.CityController.getCities));

    /**
     * Get city by id
     * @swagger
     * path:
     *  /api-rest/cities/{id}:
     *      get:
     *        tags:
     *          - Cities
     *        description: Get city by id
     *        summary: Get city by id
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
     *                      $ref: '#/components/schemas/City'
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
      '/:id',
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.CityController.getCity),
    );

    /**
     * Update the `topDestination` and `topToVisit` fields of the city
     * @swagger
     * path:
     *  /api-rest/cities/top/{id}:
     *      patch:
     *        tags:
     *          - Cities
     *        description: Update the `topDestination` and `topToVisit` fields of the city
     *        summary: Update the `topDestination` and `topToVisit` fields of the city
     *        security:
     *          - ApiKeyAuth: []
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
     *                $ref: '#/components/schemas/UpdateCityTop'
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
     *                      $ref: '#/components/schemas/City'
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
      `${CITIES.TOP}/:id`,
      this.asyncWrapper(this._identityHelpers.authenticate),
      this.asyncWrapper(this._identityHelpers.authorize([UserStatus.Active])),
      this.asyncWrapper(this.CityController.updateTop),
    );

    return router;
  }
}
