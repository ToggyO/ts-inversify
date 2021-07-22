/**
 * Description: Logger interfaces.
 */

import { IService } from 'interfaces';

export interface ILogger {
  options: { [key: string]: any };
  error(error: string): void;
  warn(warn: string): void;
  info(info: string): void;
  debug(debug: string): void;
  init(): void;
}

export enum LoggerLevelName {
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Debug = 'debug',
}

export type LoggerLevels = {
  error?: number;
  warn?: number;
  info?: number;
  debug?: number;
};

export type LoggerColors = {
  error?: string;
  warn?: string;
  info?: string;
  debug?: string;
};

export type LoggerProps = {
  mode: 'production' | 'development' | string;
  app: {
    name: string;
    version: string;
  };
};

export type Notify = {
  name: string;
  version: string;
  level: string;
  message: string;
};

export type ILoggerService = IService;
