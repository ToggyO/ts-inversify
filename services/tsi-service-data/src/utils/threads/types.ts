/**
 * Description: Types for threads module
 */

import { CommonWorkerSettings, TaskFunc } from 'node-worker-threads-pool';

export type ThreadsPoolOptions<ParamType, ResultType, WorkerData = any> = {
  size: number;
  task: string | TaskFunc<ParamType, ResultType>;
  workerData?: WorkerData;
} & CommonWorkerSettings;
