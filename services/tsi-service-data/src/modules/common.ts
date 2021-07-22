/**
 * Description: Common modules abstractions
 */

import express, { Request } from 'express';
import { Includeable, Model, ModelCtor, ModelType, Op, OrderItem } from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IApplicationError } from 'interfaces';
import { DbModels } from 'db/context';
import { Crypto, getProp, isObjectEmpty } from 'utils/helpers';
import { ERROR_CODES } from 'constants/error-codes';
import { ERROR_MESSAGES } from 'constants/error-messages';
import { ITINERARY_ERROR_MESSAGES } from 'modules/v1/itinerary/constants';
import { IAsyncWrapper } from 'utils/helpers';
import {
  IModule,
  IBaseRouter,
  DryDataWithInclude,
  DryDataWithIncludePayload,
  GetModelAttributesPayload,
  GetPagination,
  Pagination,
  QueriesInclude,
  QueriesPagination,
  QueriesFilter,
  QueriesSearch,
  UseSchemaOptions,
  QueriesSort,
  IBaseService,
  IBaseRepository,
  RequestQueries,
} from './interfaces';
import { LeopoldHelpers } from 'utils/leopold';
import { ApplicationError } from 'utils/response';
import { ValidatorError } from 'utils/validation';
import { USER_ERROR_MESSAGES } from 'modules/v1/user/constants';

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
   * Method to initialize swagger
   */
  public abstract initializeSwagger(): void;
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

export abstract class BaseModel<
  TModelAttributes extends Record<any, any> = any,
  TCreationAttributes extends Record<any, any> = TModelAttributes
> extends Model<TModelAttributes, TCreationAttributes> {
  public static readonly ModelName: string;
  public static readonly TableName: string;
  public static Models: DbModels;

  /**
   * Method to initialize the model
   */
  public static prepareInit(app: express.Application): ModelCtor<any> {
    throw new Error('prepareInit not implemented');
  }

  /**
   * Method to set all needed associations for the model
   */
  public static onAllModelsInitialized(models: DbModels): any {
    throw new Error(`All models are not initialized ${models}`);
  }
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

  /**
   * Get params from request object
   */
  protected _getParams<T>(req: Request, idFieldName = 'id'): { id: number; body: T; query: RequestQueries } {
    const id = getProp<number>(req, `params.${idFieldName}`, null);
    const body = getProp<T>(req, 'body', {});
    const query = getProp<RequestQueries>(req, 'query', {});
    return { id, body, query };
  }
}

@injectable()
export class BaseService implements IBaseService {
  public throwTransactionError(): void {
    throw new ApplicationError({
      statusCode: 500,
      errorCode: ERROR_CODES.transaction__error,
      errorMessage: ERROR_MESSAGES.TRANSACTION_ERROR,
      errors: [],
    });
  }

  public throwIdentityError(): void {
    throw new ApplicationError({
      statusCode: 404,
      errorCode: ERROR_CODES.not_found,
      errorMessage: ITINERARY_ERROR_MESSAGES.NO_VISITOR_ID,
      errors: [],
    });
  }

  /**
   * Preparing data from the model schema
   */
  public useSchema<T extends Record<string, any>, M extends ModelType>(
    values: T,
    options: UseSchemaOptions<M>,
  ): { [K in keyof T]: T[K] } {
    const {
      model: { rawAttributes },
      modelSchemaKey = '',
      callback,
      additionalAttributes = [],
    } = options;

    const modelAttributes = ((list) =>
      list.reduce(
        (accumulator, [key, value]: [string, Record<string, any>]) => [
          ...accumulator,
          ...(key && value[modelSchemaKey] ? [key] : []),
        ],
        [...additionalAttributes],
      ))(Object.entries(rawAttributes));

    const allowedValues = Object.keys(values).reduce(
      (accumulator, attrKey) => ({
        ...accumulator,
        ...(modelAttributes.includes(attrKey) ? { [attrKey]: values[attrKey] } : {}),
      }),
      {} as T,
    );

    if (callback) {
      return callback(allowedValues);
    }

    return allowedValues;
  }

  /**
   * Get a list of available attributes for a model schema
   */
  public getModelAttributes<T extends ModelType>(props: GetModelAttributesPayload<T>): Array<string> {
    const {
      model: { rawAttributes },
      additionalAttributes = [],
    } = props;
    return ((list: Array<[string, any]>) =>
      list.reduce((acc, [key, value = {}]) => [...acc, ...(key && !value._isHidden ? [key] : [])], [
        ...additionalAttributes,
      ]))(Object.entries(rawAttributes));
  }

  /**
   * Get a list of required attributes a model schema
   */
  public getRequiredModelAttributes<T extends ModelType>(props: GetModelAttributesPayload<T>): Array<string> {
    const {
      model: { rawAttributes },
      additionalAttributes = [],
    } = props;
    return ((list: Array<[string, any]>) =>
      list.reduce(
        (acc, [key, value = {}]) => [
          ...acc,
          ...(key && !value._isHidden && value._isRequiredToShow ? [key] : []),
        ],
        [...additionalAttributes],
      ))(Object.entries(rawAttributes));
  }

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

  /**
   * Create union payload schema for use in `dryPayload`
   */
  public combinePayloadSchemas(payloadArray: Array<Record<string, any>>): Record<string, any> {
    return payloadArray.reduce(
      (acc, curr) => ({
        ...acc,
        ...curr,
      }),
      {},
    );
  }

  /**
   * Clearing Inaccessible Attributes for Nested Models
   */
  public dryDataWithInclude<T extends ModelType, M extends Model>(
    props: DryDataWithIncludePayload<T, M>,
  ): DryDataWithInclude<M> {
    const { model, data } = props;

    if (!model || !data) {
      return;
    }

    const modelAssociations = model.associations;

    if (!modelAssociations) {
      return data;
    }

    const hasAnyIncludedModel = ((modelAttributes: string[], associatedModelNames: string[]) => {
      const pattern = new RegExp(associatedModelNames.join('|'));
      return pattern.test(modelAttributes.toString());
    })(Object.keys(data), Object.keys(modelAssociations));

    if (!hasAnyIncludedModel) {
      return data;
    }

    const dataJSON: Record<string, any> = data.toJSON();
    const result: Record<string, any> = {};

    Object.keys(modelAssociations).forEach((associationKey: string) => {
      const targetModel = getProp<T>(modelAssociations, `${associationKey}.target`, undefined);

      if (targetModel && dataJSON[associationKey]) {
        const availableAttributes = this.getModelAttributes<T>({ model: targetModel });

        if (Array.isArray(dataJSON[associationKey])) {
          result[associationKey] = [];

          dataJSON[associationKey].forEach((item: string, index: number) => {
            result[associationKey][index] = Object.keys(item).reduce(
              (acc, attrKey) => ({
                ...acc,
                ...(availableAttributes.includes(attrKey)
                  ? { [attrKey]: dataJSON[associationKey][index][attrKey] }
                  : {}),
              }),
              {},
            );
          });
        } else {
          result[associationKey] = Object.keys(dataJSON[associationKey]).reduce(
            (acc, attrKey) => ({
              ...acc,
              ...(availableAttributes.includes(attrKey)
                ? { [attrKey]: dataJSON[associationKey][attrKey] }
                : {}),
            }),
            {},
          );
        }
      }
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return {
      ...dataJSON,
      ...result,
    };
  }

  /**
   * Use formatted  range filtration for Sequelize
   */
  protected getRangeFilter<T>(
    fieldName: string,
    rangeStartValue: T,
    rangeEndValue: T,
  ): Record<string, Record<symbol, any>> {
    if (!rangeStartValue && !rangeEndValue) {
      return {};
    }

    const result: Record<string, Record<symbol, any>> = {
      [fieldName]: {
        [Op.gte]: rangeStartValue,
      },
    };

    if (rangeStartValue && rangeEndValue) {
      result[fieldName] = {
        [Op.between]: [rangeStartValue, rangeEndValue],
      };
      return result;
    }

    if (!rangeStartValue && rangeEndValue) {
      result[fieldName] = {
        [Op.lte]: rangeEndValue,
      };
    }

    return result;
  }

  /**
   * Use formatted pagination parameters `offset`,` limit`
   */
  public getPagination({ query }: { query: QueriesPagination }): GetPagination {
    let page = +getProp<number>(query, 'page', 1);
    let pageSize = +getProp<number>(query, 'pageSize', 0);

    if (Number.isNaN(page) || page <= 0) {
      page = 1;
    }
    if (Number.isNaN(pageSize) || pageSize <= 0) {
      pageSize = 10;
    }

    return {
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };
  }

  /**
   * Use formatted parameter `filter`
   */
  public getFilter({ query }: { query: QueriesFilter }): Record<string | symbol, any> {
    let queryFilter = getProp<string | Array<string>>(query, 'filter', undefined);

    if (!queryFilter) {
      return {};
    }

    if (typeof queryFilter === 'string') {
      queryFilter = [queryFilter];
    }

    const filterRaw = LeopoldHelpers.leopoldFilterParser(queryFilter as Array<string>);
    return LeopoldHelpers.leopoldFilterParserSequelize(filterRaw);
  }

  /**
   * Parsing sorting from query parameters
   */
  public getSort({ query }: { query: QueriesSort }): Array<OrderItem> {
    let sort = getProp<string | string[]>(query, 'sort');

    if (!sort) {
      return [];
    }

    if (Array.isArray(sort) && sort.length > 1) {
      sort = [...sort];
    }

    if (typeof sort === 'string') {
      sort = [sort];
    }

    return LeopoldHelpers.leopoldSortParserSequelize(sort);
  }

  /**
   * Use formatted parameter `include`
   */
  public getInclude({ query }: { query: QueriesInclude }): Includeable[] {
    let queryInclude = getProp<string | Array<string>>(query, 'include', []);

    if (!queryInclude) {
      return [];
    }

    if (typeof queryInclude === 'string') {
      queryInclude = [queryInclude];
    }

    queryInclude.forEach((include, index) => {
      if (!include.toString().length) {
        (queryInclude as Array<string>).splice(index, 1);
      }
    });

    return queryInclude;
  }

  /**
   * Use formatted search functionality, ready for Sequelize.Op.Or request to database
   */
  // public static getSearch(search: string, fieldNames: string[]): Record<string, any> {
  public getSearch({
    query,
    fieldNames,
  }: {
    query: QueriesSearch;
    fieldNames: Array<string>;
  }): Array<Record<string, any>> | null {
    const { search } = query;

    if (!search || !fieldNames || !fieldNames.length) {
      return null;
    }
    return fieldNames.map((fieldName: string) => ({
      [fieldName]: { [Op.like]: `%${search}%` },
    }));
  }

  /**
   * A utility method for checking the validity of account data
   * @protected
   */
  protected _checkLoginCredentials<T extends Record<string, any>>(entity: T | null, password: string): T {
    const invalidCredentialsErrorPayload = {
      statusCode: 401,
      errorCode: ERROR_CODES.authorization__invalid_credentials_error,
      errorMessage: USER_ERROR_MESSAGES.WRONG_LOGIN_CREDENTIALS,
      errors: [],
    };
    if (!entity) {
      throw new ApplicationError(invalidCredentialsErrorPayload);
    }

    const verifiedPassword = Crypto.verifyPassword(password, entity.password);

    if (!verifiedPassword) {
      throw new ApplicationError(invalidCredentialsErrorPayload);
    }

    return entity;
  }

  /**
   * Check if phone number starts with `+`
   * @protected
   */
  protected _parsePhoneNumber(phoneNumber: string): string {
    return phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  }

  /**
   * Compare incoming password and current password
   * @protected
   */
  protected _comparePasswords(oldPassword: string, currentPassword: string): boolean {
    const oldPassHash = Crypto.hashPassword(oldPassword);
    return currentPassword === oldPassHash;
  }

  /**
   * Data transformation schema for email verification payload
   * @protected
   */
  protected _loginCredentialsPayloadSchema(): Record<string, (arg: string) => string | number> {
    return {
      email: (value: string) => value,
      password: (value: string) => value,
    };
  }

  /**
   * Data transformation schema for reset user's password
   * @protected
   */
  protected _resetPasswordPayloadSchema(): Record<string, (arg: any) => any> {
    return {
      token: (value: string) => value,
      password: (value: string) => value,
    };
  }

  /**
   * Data transformation schema for change user's password
   */
  protected _changeUserPasswordPayloadSchema(): Record<string, (arg: any) => any> {
    return {
      id: (value: number) => value,
      oldPassword: (value: string) => value,
      newPassword: (value: string) => value,
    };
  }
}

@injectable()
export class BaseRepository implements IBaseRepository {
  /**
   * Pagination response format
   */
  public getPaginationResponse(
    result: { count: number },
    pagination: GetPagination | Record<string, any> = {},
  ): { pagination: Pagination } | Record<string, any> {
    if (isObjectEmpty(pagination)) {
      return {};
    }

    return {
      pagination: {
        page: Math.abs(pagination.offset / pagination.limit) + 1,
        pageSize: pagination.limit,
        total: getProp<number>(result, 'count', 0),
      },
    };
  }
}

export class BaseValidator {
  protected static throwValidationError(errors: Array<ValidatorError>): void {
    throw new ApplicationError({
      statusCode: 400,
      errorMessage: ERROR_MESSAGES.INVALID_PARAMETERS,
      errorCode: ERROR_CODES.validation,
      errors,
    });
  }
}
