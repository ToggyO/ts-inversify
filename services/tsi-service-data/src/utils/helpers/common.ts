/**
 * Description: Common helpers
 */

import { PartsOfTheDay, PartsOfTheDayTimePeriods } from 'constants/parts-of-the-day.enum';
import { json } from 'sequelize';

/**
 * Checking if value is undefined
 */
export const isUndefined = (obj: any): obj is undefined => typeof obj === 'undefined';

/**
 * Checking if typeof value is function
 */
export const isFunction = (fn: any): boolean => typeof fn === 'function';

/**
 * Checking if typeof value is string
 */
export const isString = (fn: any): fn is string => typeof fn === 'string';

/**
 * Checking if value function is an object constructor function
 */
export const isConstructor = (fn: any): boolean => fn === 'constructor';

/**
 * Checking if value is null or undefined
 */
export const isNil = (obj: any): obj is null | undefined => isUndefined(obj) || obj === null;

/**
 * Checking if typeof value is symbol
 */
export const isSymbol = (fn: any): fn is symbol => typeof fn === 'symbol';

/**
 * Checking if the value is not empty
 */
export const isEmpty = (val: any): boolean => val === undefined || val == null || val.length <= 0;

/**
 * Checking if object is empty
 */
export function isObjectEmpty(object: Record<any, any>): boolean {
  for (const key in object) {
    // eslint-disable-line
    return false;
  }
  return true;
}

/**
 * Lodash.get function implementation
 * Lets you safely retrieve a property of an object
 * https://gist.github.com/harish2704/d0ee530e6ee75bad6fd30c98e5ad9dab
 */
export function getProp<T>(object: Record<string, any>, keys: string | Array<string>, defaultVal?: any): T {
  const keysArray = Array.isArray(keys) ? keys : keys.split('.');
  const result = object[keysArray[0]];
  if (result && keysArray.length > 1) {
    return getProp(result, keysArray.slice(1));
  }

  if (object === undefined) {
    return defaultVal;
  }

  return result;
}

/**
 * Separating a file extension from a file name
 */
export function getFileExtension(filename: string): [string, string] {
  const fileName = filename.replace(/\.[^/.]+$/, '');
  const ext = filename.split('.').pop();
  return [fileName, ext!];
}

/**
 * Transform values of enumeration into array
 */
export function getEnumerationValues<E>(enumeration: E): string {
  const errorFields = Object.values(enumeration).map((e, index, array) => {
    const result = `${e}`;
    if (index === array.length - 1) {
      result.slice(0, result.length - 1);
    }
    return result;
  });
  return errorFields.join(', ');
}

/**
 * Get time by part of the day
 */
export function getTimeByPartOfTheDay(
  partOfTheDay: PartsOfTheDay,
): { startTimeSlot: string; endTimeSlot: string } {
  let startTimeSlot = '';
  let endTimeSlot = '';

  switch (partOfTheDay) {
    case PartsOfTheDay.Morning:
      startTimeSlot = PartsOfTheDayTimePeriods.MorningStart;
      endTimeSlot = PartsOfTheDayTimePeriods.MorningEnd;
      break;
    case PartsOfTheDay.Afternoon:
      startTimeSlot = PartsOfTheDayTimePeriods.AfternoonStart;
      endTimeSlot = PartsOfTheDayTimePeriods.AfternoonEnd;
      break;
    case PartsOfTheDay.Evening:
      startTimeSlot = PartsOfTheDayTimePeriods.EveningStart;
      endTimeSlot = PartsOfTheDayTimePeriods.EveningEnd;
      break;
    case PartsOfTheDay.Night:
      startTimeSlot = PartsOfTheDayTimePeriods.NightStart;
      endTimeSlot = PartsOfTheDayTimePeriods.NightEnd;
      break;
    default:
      break;
  }

  return { startTimeSlot, endTimeSlot };
}

/**
 * Transform date format from dd/mm/yyyy to yyyy-mm-dd
 */
export function createDate(date: string): string {
  const dateAsArray = date.split('/');
  const day = dateAsArray[0];
  const month = dateAsArray[1];
  const year = dateAsArray[2];
  return `${year}-${month}-${day}`;
}

/**
 * Bind class member to instance (use in constructor)
 */
export function autobind(instance: Record<string, any>, proto?: Record<string, any>): void {
  let prototype = proto;
  if (!prototype) {
    prototype = Object.getPrototypeOf(instance);
  }
  const propertyNames = Object.getOwnPropertyNames(prototype);
  for (const name of propertyNames) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    if (descriptor?.get || descriptor?.set) {
      return;
    }
    if (!isConstructor(name) && isFunction(prototype![name])) {
      instance[name] = prototype![name].bind(instance);
    }
  }
}

/**
 * Safely parse JSON strings
 */
export function safelyJsonParse<T>(json: string, defaultValue: T): T {
  let result: T;
  try {
    result = JSON.parse(json);
  } catch {
    result = defaultValue;
  }
  return result;
}

/**
 * Transform product name into slug url
 */
export const createSlug = (name: string): string => (name || '').replace(/\s/g, '-').toLowerCase();
