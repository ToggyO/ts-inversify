/**
 * Description: Types and interfaces for axios client
 */

import express from 'express';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface IAxiosClient {
  getAxios(): AxiosInstance;
}

export type AxiosClientConstructor = {
  app: express.Application;
  maxRetryAttempts?: number;
  delayRetryAttempts?: number;
};

export type CustomAxiosReqConfig = AxiosRequestConfig & {
  customHeaders?: Record<string, string>;
  _retryAttempts?: number;
};
