/**
 * Description: Class described redis client and redis helpers.
 */

import redis, { ClientOpts, RedisClient } from 'redis';
import asyncRedis from 'async-redis';
import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { autobind } from 'utils/helpers';

import { IRedisConstructor } from './interfaces';

@injectable()
export class RedisConstructor implements IRedisConstructor {
  private client: RedisClient | undefined;
  private asyncClient: RedisClient | undefined;
  private readonly options: ClientOpts | Record<string, any> = {};

  constructor(@inject(TYPES.IConfiguration) protected readonly configService: IConfiguration) {
    autobind(this);
    const isDevelopment = configService.isDevelopment;
    const host = configService.get<string>('TSI_REDIS_HOST', '');
    const port = configService.get<string>('TSI_REDIS_PORT', '');
    const password = configService.get<string>('TSI_REDIS_PASSWORD', '');
    const externalPort = configService.get<string>('TSI_REDIS_EXTERNAL_PORT', '');
    this.options = {
      host,
      port: isDevelopment ? parseInt(externalPort) : parseInt(port),
      password,
    };
  }

  public createClient(): void {
    this.client = redis.createClient(this.options);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.asyncClient = asyncRedis.createClient(this.options);
  }

  public get RedisClient(): RedisClient {
    if (!this.client) {
      this.createClient();
    }
    return this.client!;
  }

  public get AsyncRedisClient(): RedisClient {
    if (!this.client) {
      this.createClient();
    }
    return this.asyncClient!;
  }
}
