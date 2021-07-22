/**
 * Description: Country module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { UserStatus } from 'constants/user-statuses';
import { TYPES } from 'DIContainer/types';

import { ICountryHandler } from './types';

const { COUNTRY } = SERVICE_ENDPOINTS;

@injectable()
export class CountryRouter extends BaseRouter {
  public readonly routePrefix = COUNTRY.ROOT;

  constructor(@inject(TYPES.ICountryHandler) protected readonly CountryController: ICountryHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get countries
     * @swagger
     * path:
     *  /api-rest/countries:
     *      get:
     *        tags:
     *          - Countries
     *        description: Get countries of users
     *        summary: Get countries of users
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
     *                            $ref: '#/components/schemas/Country'
     */
    router.get('/', this.asyncWrapper(this.CountryController.getCountries));

    /**
     * Get country alphabetic codes
     * @swagger
     * path:
     *  /api-rest/countries/alpha-codes:
     *      get:
     *        tags:
     *          - Countries
     *        description: Get country alphabetic codes
     *        summary: Get country alphabetic codes
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
     *                      properties:
     *                        items:
     *                          type: array
     *                          items:
     *                            $ref: '#/components/schemas/AlphaCode'
     *                        pagination:
     *                          type: object
     *                          $ref: '#/components/schemas/paginationResponse'
     *          403:
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  $ref: '#/components/schemas/forbiddenResponse'
     */
    router.get(COUNTRY.ALPHA_CODES, this.asyncWrapper(this.CountryController.getAlphaCodes));

    /**
     * Get country dialing codes
     * @swagger
     * path:
     *  /api-rest/countries/dial-codes:
     *      get:
     *        tags:
     *          - Countries
     *        description: Get country dialing codes
     *        summary: Get country dialing codes
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
     *                      properties:
     *                        items:
     *                          type: array
     *                          items:
     *                            $ref: '#/components/schemas/DialCode'
     *                        pagination:
     *                          type: object
     *                          $ref: '#/components/schemas/paginationResponse'
     */
    router.get(COUNTRY.DIAL_CODES, this.asyncWrapper(this.CountryController.getDialCodes));

    /**
     * Get countries by id
     * @swagger
     * path:
     *  /api-rest/countries/{id}:
     *      get:
     *        tags:
     *          - Countries
     *        description: Get countries by id
     *        summary: Get countries by id
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
     *                      $ref: '#/components/schemas/Country'
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
      this.asyncWrapper(this.CountryController.getCountry),
    );

    return router;
  }
}
