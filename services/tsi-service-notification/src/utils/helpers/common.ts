/**
 * Description: Common helpers
 */

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
