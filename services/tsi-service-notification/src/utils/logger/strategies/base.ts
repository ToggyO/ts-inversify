import { format } from 'winston';
import { FormatWrap, TransformableInfo } from 'logform';
import { injectable } from 'inversify';

import { ILogger, LoggerLevels, LoggerProps } from '../interfaces';

@injectable()
export default class Logger implements ILogger {
  public options: LoggerProps;

  constructor(options: LoggerProps) {
    this.options = options;
  }

  public error(error: string): void {
    console.log(error);
  }
  public warn(warn: string): void {
    console.log(warn);
  }
  public info(info: string): void {
    console.log(info);
  }
  public debug(debug: string): void {
    console.log(debug);
  }

  /**
   * Init logger
   */
  public init(): void {}

  /**
   * Custom format for Winston
   */
  protected transportFormatterCustom(): FormatWrap {
    return format((info: TransformableInfo): TransformableInfo => this.transportDataFormatter(info));
  }

  /**
   * Prepare data log structure for Winston
   */
  protected transportDataFormatter(info: TransformableInfo): TransformableInfo {
    const { app } = this.options;
    const { version } = app;
    const now = new Date();
    const accidentAt = now.toISOString();
    const wasLaunchedAt = this.getUpDate();

    if (wasLaunchedAt) {
      info.wasLaunchedAt = wasLaunchedAt;
    }
    if (accidentAt) {
      info.accidentAt = accidentAt;
    }
    if (version) {
      info.version = version;
    }

    return info;
  }

  private getUpDate(): string {
    const now = Date.now();
    const upTime = process.uptime();
    const upDateInMS = now - upTime;
    const upDate = new Date(upDateInMS).toISOString();
    return upDate;
  }

  /**
   * Create list of handlers for each log types
   */
  protected logMethodsFabric(levels: LoggerLevels): void {
    console.log(levels);
  }
}
