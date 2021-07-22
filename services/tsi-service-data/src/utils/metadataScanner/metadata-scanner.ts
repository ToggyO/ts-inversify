/**
 * Description: Helper class for getting metadata
 */

import { iterate } from 'iterare';
import { injectable } from 'inversify';

import { isConstructor, isFunction, isNil } from 'utils/helpers';

import { IMetadataScanner } from './interfaces';

@injectable()
export class MetadataScanner implements IMetadataScanner {
  public scanFromPrototype<T extends Record<string, any>, R = any>(
    instance: T,
    prototype: Record<string, any>,
    callback: (name: string) => R,
  ): Array<R> {
    const methodNames = new Set(this.getAllFilteredMethodNames(prototype));
    return iterate(methodNames)
      .map(callback)
      .filter((metadata) => !isNil(metadata))
      .toArray();
  }

  private *getAllFilteredMethodNames(prototype: Record<string, any>): IterableIterator<string> {
    const isMethod = (prop: string) => {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
      if (descriptor?.get || descriptor?.set) {
        return false;
      }
      return !isConstructor(prop) && isFunction(prototype[prop]);
    };
    do {
      yield* iterate(Object.getOwnPropertyNames(prototype)).filter(isMethod).toArray();
    } while ((prototype = Reflect.getPrototypeOf(prototype)) && prototype !== Object.prototype);
  }
}
