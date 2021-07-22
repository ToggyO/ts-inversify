/**
 * Description: Class describes Leopold helper methods
 */

import { Op, OrderItem } from 'sequelize';

import { ApplicationError } from 'utils/response';
import { ERROR_CODES } from 'constants/error-codes';

import { ParsedLeopoldFilter } from './types';
import { LeopoldFilterOperations } from './enums';
import { ValidatorError } from '../validation';

export class LeopoldHelpers {
  /**
   * Parser sorting according to Leopold's standard and conversion to continuation format
   */
  public static leopoldSortParserSequelize(sort: Array<string>): Array<OrderItem> {
    return sort.map((sortOptions: string) => {
      const direction: string = sortOptions[0] === '!' ? 'DESC' : 'ASC';
      const clearSortOptions: string = sortOptions.replace('!', '');
      const sortOptionArray: Array<string> = clearSortOptions.split('.');
      return [...sortOptionArray, direction] as OrderItem;
    });
  }

  /**
   * Converting strings of the form 'field operation value' to an array of objects
   * kind {field, operation, stringValue}
   */
  public static leopoldFilterParser(filter: Array<string>): Array<ParsedLeopoldFilter> {
    const parsedFilter: Array<ParsedLeopoldFilter> = [];

    if (!Array.isArray(filter)) {
      throw new ApplicationError({
        statusCode: 400,
        errorCode: ERROR_CODES.validation,
        errorMessage: 'Filter must be an array',
        errors: [
          {
            errorCode: ERROR_CODES.validation,
            errorMessage: 'Filter must be an array',
            field: 'filter',
          },
        ],
      });
    }

    const errors: Array<ValidatorError> = [];

    filter.forEach((expression, index) => {
      const filterValues = expression.split(' ');
      const field = filterValues[0];
      const operation = filterValues[1] as LeopoldFilterOperations;
      const stringValue = filterValues[2];

      if (!field || !operation || !stringValue) {
        errors.push({
          errorCode: ERROR_CODES.validation,
          errorMessage: 'Wrong format of filter, must be: "<field> <operation> <value>"',
          field: `filter[${index}]`,
        });
      }

      parsedFilter.push({ field, operation, stringValue });
    });

    if (errors.length) {
      throw new ApplicationError({
        errorMessage: 'Wrong format of filter, must be: "<field> <operation> <value>"',
        statusCode: 400,
        errorCode: ERROR_CODES.validation,
        errors,
      });
    }

    return parsedFilter;
  }

  /**
   * Converting an array of filters to an object,
   * which can be substituted into the where clause of database queries via sequelize
   */
  public static leopoldFilterParserSequelize(
    filterArray: Array<ParsedLeopoldFilter>,
  ): Record<string | symbol, any> {
    if (!Array.isArray(filterArray)) {
      throw new ApplicationError({
        errorMessage: 'Filter must be an array',
        statusCode: 400,
        errorCode: ERROR_CODES.validation,
        errors: [
          {
            code: ERROR_CODES.validation,
            message: 'Filter must be an array',
            field: 'filter',
          },
        ],
      });
    }

    const result: Array<Record<string | symbol, any>> = [];
    let filter: Record<string | symbol, any> = { [Op.and]: result };

    filterArray.forEach((expression) => {
      const { field: fieldDefinition, operation, stringValue } = expression;
      let value;

      try {
        value = JSON.parse(stringValue);
      } catch (error) {
        value = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(stringValue)
          ? new Date(stringValue)
          : stringValue;
      }

      const filterTarget: Record<string | symbol, any> = {};
      let field: string;
      if (fieldDefinition[0] === '$') {
        field = fieldDefinition.replace('$', '');
        filter = { [Op.or]: result };
      } else {
        field = fieldDefinition;
      }

      if (field && field.split('.').length > 1) {
        field = `$${field}$`;
      }

      switch (operation) {
        case LeopoldFilterOperations.eq:
          filterTarget[field] = { [Op.eq]: value };
          break;
        case LeopoldFilterOperations.neq:
          filterTarget[field] = { [Op.ne]: value };
          break;
        case LeopoldFilterOperations.nnull:
          filterTarget[field] = { [Op.ne]: null };
          break;
        case LeopoldFilterOperations.in:
          filterTarget[field] = { [Op.in]: value };
          break;
        case LeopoldFilterOperations.lk:
          filterTarget[field] = { [Op.like]: value };
          break;
        case LeopoldFilterOperations.sw:
          filterTarget[field] = { [Op.startsWith]: value };
          break;
        case LeopoldFilterOperations.ew:
          filterTarget[field] = { [Op.endsWith]: value };
          break;
        case LeopoldFilterOperations.gt:
          filterTarget[field] = LeopoldHelpers.addAndFilter(filterTarget[field], { [Op.gt]: value });
          break;
        case LeopoldFilterOperations.gte:
          filterTarget[field] = LeopoldHelpers.addAndFilter(filterTarget[field], { [Op.gte]: value });
          break;
        case LeopoldFilterOperations.lt:
          filterTarget[field] = LeopoldHelpers.addAndFilter(filterTarget[field], { [Op.lt]: value });
          break;
        case LeopoldFilterOperations.lte:
          filterTarget[field] = LeopoldHelpers.addAndFilter(filterTarget[field], { [Op.lte]: value });
          break;
        default:
          filterTarget[field][operation] = value;
          break;
      }

      result.push(filterTarget);
    });

    return filter;
  }

  /**
   * Concatenate filters for a single field to be applied via the AND operator
   */
  private static addAndFilter(field: Record<string, any>, filter: Record<string, any>) {
    return { ...field, ...filter };
  }
}
