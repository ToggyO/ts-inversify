/**
 * Description: Class described redis helpers
 */

import { Callback, RedisClient } from 'redis';
import { injectable, inject } from 'inversify';

import { NoInferType } from 'declaration';
import { TYPES } from 'DIContainer/types';
import { autobind } from 'utils/helpers';

import { IRedisConstructor, IRedisHelpers } from './interfaces';

@injectable()
export class RedisHelpers implements IRedisHelpers {
  private redisClient: RedisClient;
  private asyncRedisClient: RedisClient;

  constructor(@inject(TYPES.IRedisConstructor) redisConstructor: IRedisConstructor) {
    autobind(this);
    this.redisClient = redisConstructor.RedisClient;
    this.asyncRedisClient = redisConstructor.AsyncRedisClient;
  }

  /**
   * Save an arbitrary data type in redis
   */
  public serializeAndSet<T>(key: string, value: T, cb?: Callback<'OK'>): boolean {
    return this.redisClient.set(key, JSON.stringify(value), cb);
  }

  /**
   * Save asynchronously an arbitrary data type in redis
   */
  public async serializeAndSetAsync<T>(key: string, value: T): Promise<boolean> {
    return this.asyncRedisClient.set(key, JSON.stringify(value));
  }

  /**
   * Save an arbitrary data type in redis. Key will be deleted after life expiration time.
   */
  public serializeAndSetWithExpiration<T>(
    key: string,
    value: T,
    expire?: number,
    cb?: Callback<'OK' | undefined>,
  ): boolean {
    if (!expire) {
      expire = 60 * 60 * 24;
    }
    return this.redisClient.set(key, JSON.stringify(value), 'EX', expire, cb);
  }

  /**
   * Save asynchronously an arbitrary data type in redis. Key will be deleted after life expiration time.
   */
  public async serializeAndSetWithExpirationAsync<T>(
    key: string,
    value: T,
    expire: number,
  ): Promise<boolean> {
    if (!expire) {
      expire = 60 * 60 * 24;
    }
    return this.asyncRedisClient.set(key, JSON.stringify(value), 'EX', expire);
  }

  /**
   * Read asynchronously an arbitrary data type in redis
   */
  public getAndDeserializeAsync<T>(key: string): Promise<T>;
  public getAndDeserializeAsync<T>(key: string, defaultValue: NoInferType<T>): Promise<T>;
  public async getAndDeserializeAsync<T>(key: string, defaultValue?: T): Promise<T> {
    const serializedValue = await this.asyncRedisClient.get(key);
    if (serializedValue) {
      let result: T;
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        result = JSON.parse(serializedValue);
      } catch (error) {
        result = defaultValue as T;
      }
      return result;
    }
    return defaultValue as T;
  }

  /**
   * Delete an arbitrary data type in redis
   */
  public delete(key: string, cb: Callback<number>): void {
    if (!key) {
      return;
    }
    this.redisClient.del(key, cb);
  }

  /**
   * Delete asynchronously an arbitrary data type in redis
   */
  public async deleteAsync(key: string): Promise<void> {
    if (!key) {
      return;
    }
    await this.asyncRedisClient.del(key);
  }
}
