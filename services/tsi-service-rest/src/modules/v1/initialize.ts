/**
 * Description: Global initialization of the 1st version of API
 */

import { Application, Router, RequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { injectable, inject, multiInject } from 'inversify';

import { IConfiguration } from 'config';
import { IBaseRouter } from 'modules/interfaces';
import { TYPES } from 'DIContainer/types';
import { getAppBaseUrl, getServerDescription } from 'utils/helpers';
import { ERROR_CODES } from 'constants/error-codes';
import { UNPROCESSABLE_ENTITY } from 'constants/response-codes';

import { Module } from '../common';

@injectable()
export class ModuleV1 extends Module {
  protected readonly routerCollection: IBaseRouter[];
  protected readonly identityHeader: string;

  /**
   * Initializing routing
   */
  constructor(
    @inject(TYPES.IConfiguration) protected readonly configService: IConfiguration,
    @multiInject(TYPES.IBaseRouter) routers: Array<IBaseRouter>,
  ) {
    super();
    this.routerCollection = routers;
    this.identityHeader = this.configService.get<string>('IDENTITY_HEADER', '');
  }

  /**
   * Initializing routing
   */
  public createRouter(): Router {
    this.routerCollection.forEach((router: IBaseRouter) => {
      this.router.use(router.routePrefix, router.initRoutes());
    });

    /**
     * Get pong
     * @swagger
     * path:
     *  /api-rest:
     *      get:
     *        tags:
     *          - Ping
     *        description: Get pong
     *        summary: Get pong
     *        produces:
     *          - application/json
     *        responses:
     *          200:
     *            description: Successful operation
     */
    this.router.get('/', async (req: any, res: any) => res.send('pong'));

    return this.router;
  }

  /**
   * Initializing models
   */
  public initializeModels(app: Application): void {}

  /**
   * Initializing API documentation
   */
  public initializeSwagger(basePath: string): RequestHandler {
    const identityHeader = this.configService.get<string>('IDENTITY_HEADER', '');
    const modulesSwaggerSchemes = {
      /* eslint-disable @typescript-eslint/no-var-requires */
      ...require('./swagger.json').schemas,
      ...require('./auth/swagger.json').schemas,
      ...require('./product/swagger.json').schemas,
      ...require('./city/swagger.json').schemas,
      ...require('./user/swagger.json').schemas,
      ...require('./country/swagger.json').schemas,
      ...require('./cart/swagger.json').schemas,
      ...require('./profile/swagger.json').schemas,
      ...require('./payment/swagger.json').schemas,
      ...require('./headout/swagger.json').schemas,
      ...require('./category/swagger.json').schemas,
      ...require('./support/swagger.json').schemas,
      ...require('./admin/product/swagger.json').schemas,
      ...require('./admin/promo-code/swagger.json').schemas,
      ...require('./admin/auth/swagger.json').schemas,
      ...require('./admin/profile/swagger.json').schemas,
      ...require('./admin/user/swagger.json').schemas,
      /* eslint-enable @typescript-eslint/no-var-requires */
    };

    const swaggerOptions: swaggerJSDoc.Options = {
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'Easy guide REST service. API Documentation.',
          version: '1.0',
          description:
            `WARNING! This API uses "${this.identityHeader}" header to identify you as User or Guest.` +
            ` Include the value from "${this.identityHeader}" header from response per every request,` +
            ' if you want to be identify as User or Guest. To be identified as User,' +
            ` you must login into app and use returned value from "${this.identityHeader}" header.`,
        },
        basePath,
        servers: [
          {
            url: getAppBaseUrl(),
            description: `${getServerDescription()} server`,
          },
        ],
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        components: {
          securitySchemes: {
            ApiKeyAuth: {
              type: 'apiKey',
              in: 'header',
              name: identityHeader,
            },
          },
          schemas: {
            ...modulesSwaggerSchemes,
            IdentityHeader: {
              in: 'header',
              name: 'Identity',
              description: 'Add api token, if you want to identify Guest or User',
              schema: {
                type: 'string',
              },
            },
            IdentityHeaderRequired: {
              in: 'header',
              name: 'Identity',
              description: 'Add api token, if you want to identify Guest or User',
              required: true,
              schema: {
                type: 'string',
              },
            },
            paginationPage: {
              in: 'query',
              name: 'page',
              description: 'Page number',
              required: false,
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: 1000,
                default: '1',
              },
            },
            include: {
              in: 'query',
              name: 'include',
              description: 'Include additional related entities in the response.',
              required: false,
              schema: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
            paginationSize: {
              in: 'query',
              name: 'pageSize',
              description: 'Items per page',
              required: false,
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: 1000,
                default: 10,
              },
            },
            filter: {
              in: 'query',
              name: 'filter',
              description:
                'Filter (accepted operators: eq, neq, nnull, in, lk, sw, ew, gt, gte, lt, lte).' +
                ' Example: `field eq value` \n' +
                'By default all filters are used with AND operator. \n' +
                'Use "$" before field name to apply OR operator.' +
                ' Example of usage by two columns: ' +
                '`filter=$name lk %substring%&filter=$organizationName lk %substring%`',
              required: false,
              schema: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
            sort: {
              in: 'query',
              name: 'sort',
              description: 'Sorter rules: asc sorting - `{fieldName}`, desc sorting - `!{fieldName}`',
              required: false,
              schema: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
            paginationResponse: {
              type: 'object',
              properties: {
                page: {
                  type: 'number',
                },
                pageSize: {
                  type: 'number',
                },
                total: {
                  type: 'number',
                },
              },
            },
            unauthorizedResponse: {
              description: 'Unauthorized',
              type: 'object',
              properties: {
                errorCode: { type: 'number', example: ERROR_CODES.security__invalid_token_error },
                errorMessage: { type: 'string' },
              },
            },
            incorrectParamsResponse: {
              description: 'Invalid income parameters format',
              type: 'object',
              properties: {
                errorCode: { type: 'number', example: ERROR_CODES.validation },
                errorMessage: { type: 'string' },
                errors: { items: { type: 'string' } },
              },
            },
            forbiddenResponse: {
              description: 'Permission denied',
              type: 'object',
              properties: {
                errorCode: { type: 'number', example: ERROR_CODES.security__no_permissions },
                errorMessage: { type: 'string' },
              },
            },
            notAcceptableResponse: {
              description: 'Request cannot be completed',
              type: 'object',
              properties: {
                errorCode: { type: 'number', example: ERROR_CODES.notAcceptable },
                errorMessage: { type: 'string' },
              },
            },
            notFoundResponse: {
              description: 'Not found',
              type: 'object',
              properties: {
                errorCode: { type: 'number', example: ERROR_CODES.not_found },
                errorMessage: { type: 'string' },
              },
            },
            unprocessableEntityResponse: {
              description: 'Unprocessable entity',
              type: 'object',
              properties: {
                errorCode: { type: 'number', example: UNPROCESSABLE_ENTITY },
                errorMessage: { type: 'string' },
              },
            },
          },
        },
      },
      apis: [
        `${process.cwd()}/src/modules/v1/**/*.router.ts`,
        `${process.cwd()}/src/modules/v1/initialize.ts`,
      ],
    };

    const swaggerSpec = swaggerJSDoc(swaggerOptions);

    return swaggerUi.setup(swaggerSpec);
  }
}
