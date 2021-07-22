/**
 * Description: Worker threads pool constructor
 * !! Only transient scope for IoC
 */

import { StaticPool } from 'node-worker-threads-pool';
import { injectable } from 'inversify';

import { IThreadsPoolConstructor } from './interfaces';
import { ThreadsPoolOptions } from './types';

@injectable()
export class ThreadsPoolConstructor<ParamType, ResultType, WorkerData = any>
  implements IThreadsPoolConstructor<ParamType, ResultType, WorkerData> {
  private _pool: StaticPool<ParamType, ResultType, WorkerData>;

  public create(
    options: ThreadsPoolOptions<ParamType, ResultType, WorkerData>,
  ): StaticPool<ParamType, ResultType, WorkerData> {
    if (!this._pool) {
      this._pool = new StaticPool<ParamType, ResultType, WorkerData>(options);
    }
    return this._pool;
  }

  public get pool(): StaticPool<ParamType, ResultType, WorkerData> {
    return this._pool;
  }
}
