/**
 * Description: Database connection
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { ConnectorOptions, IConnector, IDatabaseConnectionService } from 'db/interfaces';
import { STORAGE_KEYS } from 'constants/storage-keys';

/**
 * Starting the process of connecting to the database
 */
@injectable()
export class DatabaseConnection implements IDatabaseConnectionService {
  readonly dbConnectionProvider: (options: ConnectorOptions) => IConnector;

  constructor(
    @inject(TYPES.IConfiguration) private readonly configService: IConfiguration,
    @inject(TYPES.IFactoryOfDBConnection) provider: (options: ConnectorOptions) => IConnector,
  ) {
    this.dbConnectionProvider = provider;
  }

  public async run(app: express.Application): Promise<void> {
    try {
      const host = this.configService.get<string>('TSI_MYSQL_HOST');
      const dbPort = this.configService.get<string>('TSI_MYSQL_PORT', '');
      const dbExtPort = this.configService.get<string>('TSI_MYSQL_EXTERNAL_PORT', '');
      const port = this.configService.isDevelopment ? parseInt(dbExtPort, 10) : parseInt(dbPort, 10);

      const db = await this.dbConnectionProvider({
        dbName: this.configService.get<string>('TSI_MYSQL_DATABASE', ''),
        dbUser: this.configService.get<string>('TSI_MYSQL_USER', ''),
        dbPassword: this.configService.get<string>('TSI_MYSQL_PASSWORD', ''),
        dbOptions: {
          host,
          port,
          dialect: 'mysql',
          logging: this.configService.isDevelopment ? (sql) => console.log(sql) : false,
        },
      });
      console.info(`Successfully connected to database on host: ${host}, port: ${port}`);
      app.set(STORAGE_KEYS.DB, db);
    } catch (error) {
      console.info('Database connection error: ', error);
    }
  }

  public destroy(): void {}
}
