/**
 * Description: A set of methods for converting query parameters from sequelize format to sql
 */

import { Op } from 'sequelize';

export class SqlHelpers {
  /**
   * Format sequelize order to SQL
   */
  public static createOrderCondition(order: Array<any[]>, alias?: string): string {
    if (!order.length) {
      return '';
    }

    let result = '';
    const prefix = alias ? `${alias}.` : '';

    order.forEach((item, index) => {
      const r = item.map((x) => `${x} ${item[item.length - 1]}`).slice(0, item.length - 1);
      const delimeter = index > 0 ? ', ' : '';
      result += `${delimeter}${prefix}${r.join(', ')}`;
    });
    return `ORDER BY ${result}`;
  }

  /**
   * Create `WHERE` condition for SQL
   */
  public static createWhereCondition(...conditions: Array<string | null>): string {
    let where = '';
    let isConditionCreationStarts = true;
    for (const condition of conditions) {
      if (!condition) {
        continue;
      }
      const operator = isConditionCreationStarts ? 'WHERE ' : ' AND ';
      isConditionCreationStarts = false;
      where += `${operator}${condition}`;
    }
    return where;
  }

  /**
   * Format sequelize seach to SQL
   */
  public static createSearchCondition(search: Array<Record<string, any>> | null): string | null {
    if (!search) {
      return null;
    }

    let result = '';
    let isConditionCreationStarts = true;
    search.forEach((item) => {
      const r = Object.entries(item)
        .map(([key, val]) => `${key} LIKE '${val[Op.like]}'`)
        .join('');
      const operator = isConditionCreationStarts ? '' : ' OR ';
      isConditionCreationStarts = false;
      result += `${operator}${r}`;
    });

    if (search.length > 1) {
      result = `(${result})`;
    }
    return result;
  }
}
