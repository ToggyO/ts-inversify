/**
 * Description: Class described application key-value storage
 */

import { injectable } from 'inversify';

import { IApplicationStorage } from 'interfaces';

import { AppStorage } from './types';

@injectable()
export class ApplicationStorage implements IApplicationStorage {
  private readonly storage: AppStorage = new Map<string, any>();

  public set<TValue = any>(key: string, value: TValue): void {
    let stringedKey: string;

    try {
      stringedKey = String(key);
    } catch (error) {
      console.log('Provided key cannot be stringed');
      return;
    }

    this.storage.set(stringedKey, value);
  }

  public get<TValue = any>(key: string): TValue | null {
    const isExists: boolean = this.storage.has(key);

    if (!isExists) {
      return null;
    }

    return this.storage.get(key) as TValue;
  }

  public getStoredItemsCount(): number {
    return this.storage.size;
  }
}
