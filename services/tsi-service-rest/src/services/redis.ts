/**
 * Description: Redis service configuration
 */

import * as express from 'express';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IRedisConstructor } from 'utils/redis';
import { STORAGE_KEYS } from 'constants/storage-keys';

import { IService } from '../interfaces';

@injectable()
export class RedisService implements IService {
  private readonly _redisConstructor: IRedisConstructor;

  constructor(@inject(TYPES.IRedisConstructor) redisConstructor: IRedisConstructor) {
    this._redisConstructor = redisConstructor;
  }

  public run(app: express.Application): void {
    this._redisConstructor.createClient();
    app.set(STORAGE_KEYS.REDIS, this._redisConstructor.RedisClient);
    app.set(STORAGE_KEYS.ASYNC_REDIS, this._redisConstructor.AsyncRedisClient);
  }

  public destroy(): void {}
}
