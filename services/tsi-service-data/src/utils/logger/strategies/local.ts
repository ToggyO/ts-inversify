/**
 * Description: Class describes development logger strategy.
 */

import path from 'path';
import chalk from 'chalk';
import notifier from 'node-notifier';
import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { NodeEnv } from 'constants/node-env.enum';

import { LoggerLevelName, LoggerLevels, LoggerColors, Notify } from '../interfaces';
import Logger from './base';
import pack from '../../../../package.json';

@injectable()
export default class LocalStrategy extends Logger {
  protected levels: LoggerLevels;
  protected colors: LoggerColors;
  public test = Math.random() * 1000;

  constructor(@inject(TYPES.IConfiguration) protected readonly configService: IConfiguration) {
    super({
      mode: configService.get<NodeEnv>('NODE_ENV', NodeEnv.Development),
      app: { name: pack.name, version: pack.version },
    });
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
    this.colors = {
      debug: 'orange',
      warn: 'yellow',
      info: 'green',
      error: 'red',
    };
  }

  /**
   * Init logger
   */
  public init(): void {
    this.logMethodsFabric(this.levels);
  }

  /**
   * Get icon for notification
   */
  protected getIcon(level: string): string {
    switch (level) {
      case LoggerLevelName.Info:
        return '../success.png';
      case LoggerLevelName.Error:
        return '../deprecation.png';
      default:
        return '../warn';
    }
  }

  /**
   * Notification to local dev machine
   */
  private notify({ name, version, level, message }: Notify): void {
    const options = {
      sound: true,
      wait: true,
      // Choose your icon
      icon: path.join(__dirname, this.getIcon(level)),
    };

    notifier.notify({
      title: `${name} v.${version} got ${level} message`,
      message,
      ...options,
    });
  }

  /**
   * Create list of handlers for each log types
   */
  protected logMethodsFabric(levels: LoggerLevels): void {
    const { app } = this.options;
    const custom = super.transportFormatterCustom();
    const customConsole = custom({ type: 'console' });

    Object.keys(levels).forEach((level) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this[level] = (message: unknown, options: Record<string, any> = {}) => {
        if (typeof message !== 'string') {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { color = this.colors[level] } = options;
        const coloredOutput = chalk.keyword(color);
        const { name = 'server', version = 'unknown' } = app;
        const logMessage = (() => {
          let msg;
          try {
            // FIXME: add second arg { type: 'console' }
            msg = JSON.stringify(customConsole.transform({ level, message }));
          } catch (error) {
            msg = '';
          }
          return msg;
        })();

        this.notify({
          name,
          version,
          level,
          message,
        });

        if (level !== 'error') {
          console.log(coloredOutput(`[${level.toUpperCase()}] ${logMessage}`));
        } else {
          console.error(coloredOutput(`[${level.toUpperCase()}] ${logMessage}`));
        }
      };
    });
  }
}
