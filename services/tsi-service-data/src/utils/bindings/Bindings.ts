/**
 * Description: Helper class allows to get inversify binding dictionary
 * and apply some function on elements than dictionary contains
 */

import { injectable, interfaces } from 'inversify';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getBindingDictionary } from 'inversify/lib/planning/planner';

import { IBindingDictionaryService } from './interfaces';

@injectable()
export class Bindings implements IBindingDictionaryService {
  /**
   * Get Map of bindings of inversify container
   */
  public getBindingDictionary(container: interfaces.Container): interfaces.Lookup<interfaces.Binding<any>> {
    return getBindingDictionary(container);
  }

  /**
   * Apply a function to each element binding dictionary
   */
  public traverse(
    bindingDictionary: interfaces.Lookup<interfaces.Binding<any>>,
    func: (key: interfaces.ServiceIdentifier<any>, value: any[]) => void,
  ): void {
    bindingDictionary.traverse(func);
  }
}
