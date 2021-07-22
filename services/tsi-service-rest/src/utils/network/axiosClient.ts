/**
 * Description: Network layer
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { injectable } from 'inversify';

import { CustomAxiosReqConfig, IAxiosClient } from './types';
import { getProp } from '../helpers';

@injectable()
export class AxiosClient implements IAxiosClient {
  protected client: AxiosInstance;
  protected log = { warn: this.warn };
  protected delayRetryAttempts = 0;
  protected maxRetryAttempts = 0;

  constructor() {
    const defaultMaxRetryAttempts = 0;
    // const defaultMaxRetryAttempts = isDevelopment ? 0 : 3;
    const { maxRetryAttempts = defaultMaxRetryAttempts, delayRetryAttempts = 10 } = this;
    const localAxios = axios.create();

    this.log = { warn: this.warn };

    // Request interceptors
    localAxios.interceptors.request.use((reqConfig: CustomAxiosReqConfig) => {
      let cacheHeaders = {};
      // reqConfig.maxContentLength = Infinity;
      // reqConfig.maxBodyLength = Infinity;

      if (reqConfig.method && reqConfig.method.toLowerCase() === 'get') {
        cacheHeaders = {
          ...cacheHeaders,
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        };
      }

      // Request headers
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...cacheHeaders,
        ...(reqConfig.customHeaders || {}),
      };

      return {
        ...reqConfig,
        ...headers,
      };
    });

    // Response interceptor
    localAxios.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const originalRequest: CustomAxiosReqConfig = error.config;
        const errorData = error.response;
        const useCustomErrorMessageHandling = getProp(error, 'config.useCustomErrorMessageHandling');

        if (typeof useCustomErrorMessageHandling === 'function') {
          const errorMessage = useCustomErrorMessageHandling(error);
          this.log.warn(errorMessage);
        }

        if (typeof originalRequest._retryAttempts === 'number') {
          originalRequest._retryAttempts += 1;
        } else {
          originalRequest._retryAttempts = 0;
        }

        if (originalRequest._retryAttempts >= maxRetryAttempts) {
          return errorData;
        }

        return new Promise((resolve) => {
          setTimeout(() => resolve(localAxios(originalRequest)), delayRetryAttempts * 1000);
        });
      },
    );

    this.client = localAxios;
  }

  protected warn(...props: string[]): void {
    console.warn(props);
  }

  public getAxios(): AxiosInstance {
    return this.client;
  }
}
