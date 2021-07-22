/**
 * Description: Common modules abstractions
 */

import express, { Request } from 'express';
import { AxiosInstance, AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { ApplicationError, Success } from 'utils/response';
import { getProp, IAsyncWrapper } from 'utils/helpers';
import { IIdentityHelpers } from 'utils/authentication';
import { CustomerDTO } from 'modules/v1/auth';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { ERROR_CODES } from 'constants/error-codes';
import { User } from 'modules/v1/user';
import { IProcessedFile } from 'utils/fileHandle';
import { CreateCustomerDTO } from 'modules/v1/payment';

import { IModule, IBaseRouter, RequestQueries } from './interfaces';

const { USERS, PAYMENT, getDataServiceUrl, getPaymentServiceUrl } = SERVICE_ENDPOINTS;

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
  public abstract initializeSwagger(basePath: string): express.RequestHandler;
}

@injectable()
export abstract class BaseRouter implements IBaseRouter {
  public abstract readonly routePrefix: string;
  public readonly router: express.Router = express.Router();

  @inject(TYPES.AsyncWrapper)
  protected readonly asyncWrapper: IAsyncWrapper;

  @inject(TYPES.IIdentityHelpers)
  protected readonly _identityHelpers: IIdentityHelpers;

  /**
   * Method to initialize the router
   */
  public abstract initRoutes(): express.Router;
}

@injectable()
export class BaseController {
  @inject(TYPES.IAxiosInstance)
  protected readonly axios: AxiosInstance;

  protected throwNonSuccessResponseError(response: AxiosResponse): void {
    const { status, data = {} } = response;
    const { errorCode, errorMessage, errors = [] } = data;
    throw new ApplicationError({
      statusCode: status,
      errorMessage,
      errorCode,
      errors,
    });
  }

  /**
   * Get params from request object
   */
  protected _getParams<T>(req: Request, idFieldName = 'id'): { id: number; body: T; stringedQuery: string } {
    const id = getProp<number>(req, `params.${idFieldName}`, null);
    const body = getProp<T>(req, 'body', {});
    const query = getProp<RequestQueries>(req, 'query', {});
    const stringedQuery = stringify(query, { addQueryPrefix: true });
    return { id, body, stringedQuery };
  }

  /**
   * Get params from request object
   */
  protected _getFiles(req: Request, multiple?: boolean): IProcessedFile {
    const fieldName = multiple ? 'files' : 'file';
    const result = getProp<IProcessedFile>(req, fieldName, {});
    if (!result) {
      throw new ApplicationError({
        statusCode: 409,
        errorCode: ERROR_CODES.conflict,
        errorMessage: 'File is required',
        errors: [],
      });
    }
    return result;
  }

  /**
   *
   */
  // TODO: Add description
  protected async _createStripeCustomerToken(customerDto: CreateCustomerDTO, userId: number): Promise<User> {
    const paymentServiceResponse: AxiosResponse<Success<CustomerDTO>> = await this.axios.post(
      getPaymentServiceUrl(PAYMENT.STRIPE.CUSTOMER_CREATE),
      customerDto,
    );

    if (paymentServiceResponse.status !== 201) {
      this.throwNonSuccessResponseError(paymentServiceResponse);
    }

    const { resultData: customer } = paymentServiceResponse.data;

    const response: AxiosResponse<Success<User>> = await this.axios.patch(
      getDataServiceUrl(USERS.UPDATE_CUSTOMER_TOKEN_REQUEST(userId)),
      { stripeCustomerToken: customer.stripeCustomerToken },
    );

    if (response.status !== 200) {
      this.throwNonSuccessResponseError(response);
    }
    return response.data.resultData;
  }
}
