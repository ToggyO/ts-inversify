/**
 * Description: Common modules abstractions
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { IApplicationError } from 'interfaces';
import { TYPES } from 'DIContainer/types';
import { IAsyncWrapper } from 'utils/helpers';
import { ApplicationError } from 'utils/response';
import { ERROR_CODES } from 'constants/error-codes';
import { ERROR_MESSAGES } from 'constants/error-messages';

import { IModule, IBaseRouter, IBaseService } from './interfaces';

@injectable()
export abstract class Module implements IModule {
  public readonly router: express.Router = express.Router();
  protected abstract routerCollection: IBaseRouter[];

  /**
   * Method to initialize all routers
   */
  public createRouter(): express.Router {
    return this.router;
  }

  /**
   * Method to initialize all models
   */
  public abstract initializeModels(args: any): any;

  /**
   * Method to initialize swagger
   */
  public abstract initializeSwagger(args: any): any;
}

@injectable()
export abstract class BaseRouter implements IBaseRouter {
  public abstract readonly routePrefix: string;
  public readonly router: express.Router = express.Router();

  @inject(TYPES.AsyncWrapper)
  protected readonly asyncWrapper: IAsyncWrapper;

  /**
   * Method to initialize the router
   */
  public abstract initRoutes(): express.Router;
}

@injectable()
export class BaseController {
  public notFoundErrorPayload(message: string): IApplicationError {
    return {
      statusCode: 404,
      errorMessage: message,
      errorCode: ERROR_CODES.not_found,
      errors: [],
    };
  }
}

@injectable()
export class BaseService implements IBaseService {
  /**
   * Preparation and formatting of input data for creating / modifying an entity
   */
  public dryPayload<
    T extends Record<string, any>,
    U extends Record<string, any> = Record<string, (arg: any) => any>
  >(payload: T, schema: U): T {
    return Object.keys(schema).reduce((accumulator, propName) => {
      let data: Record<string, any> = {};
      try {
        const value = schema[propName](payload[propName]);
        if (typeof value !== 'undefined') {
          data[propName] = value;
        }
      } catch (error) {
        data = {};
      }
      return {
        ...accumulator,
        ...data,
      };
    }, {} as T);
  }
}
export class BaseValidator {
  protected static throwValidationError(errors: Array<any>): void {
    throw new ApplicationError({
      statusCode: 400,
      errorMessage: ERROR_MESSAGES.INVALID_PARAMETERS,
      errorCode: ERROR_CODES.validation,
      errors,
    });
  }
}
