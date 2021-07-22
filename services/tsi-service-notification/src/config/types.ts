/**
 * Description: Application settings types defining and export
 */

import { NoInferType } from 'declaration';

export type AppConfig = {
  [key: string]: string;
};

export type EnvironmentVars = {
  [key: string]: string;
};

export interface IConfiguration<K = Record<string, any>> {
  get<T = any>(propertyPath: keyof K): T | undefined;
  get<T = any>(propertyPath: keyof K, defaultValue: NoInferType<T>): T;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
}
