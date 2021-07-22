/**
 * Description: Interfaces for redis client
 */

import { Callback, RedisClient } from 'redis';
import { NoInferType } from '../../declaration';

export interface IRedisConstructor {
  createClient(): void;
  RedisClient: RedisClient;
  AsyncRedisClient: RedisClient;
}

export interface IRedisHelpers {
  getAndDeserializeAsync<T>(key: string): Promise<T>;
  getAndDeserializeAsync<T>(key: string, defaultValue: NoInferType<T>): Promise<T>;
  serializeAndSet<T>(key: string, value: T, cb?: Callback<'OK' | undefined>): boolean;
  serializeAndSetAsync<T>(key: string, value: T): Promise<boolean>;
  serializeAndSetWithExpiration<T>(
    key: string,
    value: T,
    expire?: number,
    cb?: Callback<'OK' | undefined>,
  ): boolean;
  serializeAndSetWithExpirationAsync<T>(key: string, value: T, expire?: number): Promise<boolean>;
  delete(key: string, cb: Callback<number>): void;
  deleteAsync(key: string): Promise<void>;
}
