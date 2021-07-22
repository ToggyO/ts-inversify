/**
 * Description: Application settings import from .env.* files
 */
import { EnvironmentVars } from './types';

export class Environment {
  public allowedEnvList: string[];
  public envVariables: EnvironmentVars = {};

  constructor(envList: string[]) {
    this.allowedEnvList = envList;
    this.defineEnvVariables();
    console.table(this.getVariablesForPrint());
  }

  private defineEnvVariables() {
    this.envVariables = Object.keys(process.env).reduce(
      (accumulator: EnvironmentVars, envName: string): EnvironmentVars => {
        if (this.allowedEnvList.includes(envName)) {
          accumulator[envName] = process.env[envName] as string;
        }
        return accumulator;
      },
      {},
    );
  }

  private getVariablesForPrint(): EnvironmentVars {
    return Object.keys(this.envVariables).reduce(
      (accumulator: EnvironmentVars, envName: string): EnvironmentVars => {
        const MAX_LENGTH = 80;
        const vars = this.envVariables;
        const variableIsNotEmpty: boolean = typeof vars[envName] === 'string' && vars[envName].length > 0;
        const useCutting: boolean = variableIsNotEmpty && vars[envName].length > MAX_LENGTH;
        const variable: string = useCutting ? `${vars[envName].substr(0, MAX_LENGTH)}...` : vars[envName];
        return {
          ...accumulator,
          [envName]: variable,
        };
      },
      {},
    );
  }
}
