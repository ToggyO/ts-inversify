/**
 * Description: Interfaces for bindings service
 */

import { interfaces } from 'inversify';

export interface IBindingDictionaryService {
  getBindingDictionary(container: interfaces.Container): interfaces.Lookup<interfaces.Binding<any>>;
  traverse(
    bindingDictionary: interfaces.Lookup<interfaces.Binding<any>>,
    func: (key: interfaces.ServiceIdentifier<any>, value: any[]) => void,
  ): void;
}
