/**
 * Description: Application configuration storage
 */

import { readFileSync } from 'fs';

import { injectable } from 'inversify';
import get from 'lodash.get';

import { NoInferType } from 'declaration';

import allowedEnvList from '../../env-list';
import { Environment } from './Environment';
import { IConfiguration } from './types';

@injectable()
export class ConfigurationService<K = Record<string, any>> implements IConfiguration<K> {
  private static _config: Record<string, any> = {};
  private readonly _configurationStore: Record<string, any> = {};

  constructor() {
    const envVars = new Environment(allowedEnvList).envVariables;
    const appConfig = { ...ConfigurationService._config, ...envVars };

    Object.entries(appConfig).forEach(([key, val]) => {
      this._configurationStore[key] = val;
    });
  }

  private static _getConfig(configPath: string): void {
    try {
      let _config;
      if (configPath.endsWith('.js') || configPath.endsWith('.ts')) {
        _config = require(configPath);
      } else {
        const file = readFileSync(configPath, 'utf-8');
        _config = JSON.parse(file);
      }
      ConfigurationService._config = { ...ConfigurationService._config, ..._config };
    } catch (error) {
      ConfigurationService._config = {};
    }
  }

  public static setConfigPath(configPath: string): void {
    ConfigurationService._getConfig(configPath);
  }

  public get isDevelopment(): boolean {
    const NODE_ENV = this._configurationStore['NODE_ENV'];
    return NODE_ENV === 'development';
  }

  public get isStaging(): boolean {
    const NODE_ENV = this._configurationStore['NODE_ENV'];
    return NODE_ENV === 'staging';
  }

  public get isProduction(): boolean {
    const NODE_ENV = this._configurationStore['NODE_ENV'];
    return NODE_ENV === 'production';
  }

  public get<T = any>(propertyPath: keyof K): T | undefined;
  public get<T = any>(propertyPath: keyof K, defaultValue: NoInferType<T>): T;
  public get<T = any>(propertyPath: keyof K, defaultValue?: T): T | undefined {
    const value = get(this._configurationStore, propertyPath);
    if (value) {
      return (value as unknown) as T;
    }
    return defaultValue;
  }
}
