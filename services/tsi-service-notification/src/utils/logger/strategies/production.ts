/**
 * Description: Class described production logger strategy.
 */

import path from 'path';
import fs from 'fs';
import { createLogger, transports, format } from 'winston';
import chalk from 'chalk';
import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { NodeEnv } from 'constants/common';

import { LoggerLevels, LoggerColors } from '../interfaces';
import Logger from './base';
import pack from '../../../../package.json';

const { combine, json, prettyPrint } = format;

@injectable()
export default class ProductionStrategy extends Logger {
  protected levels: LoggerLevels;
  protected colors: LoggerColors;
  private catalogName = 'log';

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

    // ensure log directory exists
    const logDirectory = path.join(__dirname, `../../../../${this.catalogName}`);
    // eslint-disable-next-line no-unused-expressions
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    this.logMethodsFabric(this.levels);
  }

  /**
   * Init logger
   */
  public init(): void {
    this.logMethodsFabric(this.levels);
  }

  /**
   * Prepare Winston transport
   */
  private transportCreator = ({ level }: { level: string }) => {
    const custom = super.transportFormatterCustom();
    const fileTransport = new transports.File({
      level,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      name: `file#${level}`,
      filename: `${this.catalogName}/${level}.log`,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      format: combine(custom({ type: 'file' }), json(), prettyPrint()),
    });

    return [fileTransport];
  };

  /**
   * Create list of handlers for each log types
   * @param {object} levels
   * @private
   */
  protected logMethodsFabric = (levels = {}) => {
    const custom = this.transportFormatterCustom();
    const customConsole = custom({ type: 'console' });

    Object.keys(levels).forEach((level) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this[`${level}Logger`] = this.loggerCreator(level);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this[level] = (message, options: Record<string, any> = {}) => {
        if (typeof message !== 'string') {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { color = this.colors[level] } = options;
        const coloredOutput = chalk.keyword(color);
        const logMessage = (() => {
          let msg;
          try {
            msg = JSON.stringify(customConsole.transform({ level, message }));
          } catch (error) {
            msg = '';
          }
          return msg;
        })();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[`${level}Logger`].log({ level, message });

        if (level !== 'error') {
          console.log(coloredOutput(`[${level.toUpperCase()}] ${logMessage}`));
        } else {
          console.error(coloredOutput(`[${level.toUpperCase()}] ${logMessage}`));
        }
      };
    });
  };

  /**
   * Prepare Winston logger by a level
   */
  private loggerCreator = (level: string) => {
    const { app } = this.options;
    const { name = 'server' } = app;
    return createLogger({
      level,
      defaultMeta: { service: name },
      transports: this.transportCreator({ level }),
      exitOnError: false,
    });
  };
}
