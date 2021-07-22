/**
 * Description: Application shutdown handler
 */

import http from 'http';

import { IApplicationShutdown } from './interfaces.d';

export class ApplicationShutdown implements IApplicationShutdown {
  private readonly _exitCode: number = 0;

  constructor(exitCode?: number) {
    if (exitCode) {
      this._exitCode = exitCode;
    }
  }

  private async handleExit(
    signal: string | number,
    server: http.Server,
    beforeExitAction?: () => Promise<void>,
  ): Promise<void> {
    if (beforeExitAction) {
      await beforeExitAction();
    }
    server.close((error) => {
      if (error) {
        return process.exit(1);
      }
      return process.exit();
    });
  }

  public async shutdownHandler(server: http.Server, beforeExitAction?: () => Promise<void>): Promise<void> {
    process.exitCode = this._exitCode;

    // do something when app is closing
    process.on('exit', async (code) => {
      if (code === this._exitCode) {
        console.log(`Gracefully stopped with code: ${code}`);
        return;
      }
      console.log(`Exited with error code: ${code}`);
    });

    // catches ctrl+c event
    process.on('SIGINT', async (signal) => {
      this.handleExit(signal, server, beforeExitAction);
    });

    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', async (signal) => {
      this.handleExit(signal, server, beforeExitAction);
    });
    process.on('SIGUSR2', async (signal) => {
      this.handleExit(signal, server, beforeExitAction);
    });
  }
}
