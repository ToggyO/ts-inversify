/**
 * Description: Interfaces for threads module
 */

import { StaticPool } from 'node-worker-threads-pool';

import { ThreadsPoolOptions } from './types';

export interface IThreadsPoolConstructor<ParamType, ResultType, WorkerData = any> {
  create(
    options: ThreadsPoolOptions<ParamType, ResultType, WorkerData>,
  ): StaticPool<ParamType, ResultType, WorkerData>;
  pool: StaticPool<ParamType, ResultType, WorkerData>;
}
