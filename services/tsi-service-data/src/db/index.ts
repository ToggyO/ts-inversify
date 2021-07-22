/**
 * Description: Class for interacting with the database and common system methods
 */

import { Sequelize } from 'sequelize';
import { injectable } from 'inversify';

import { ConnectorOptions, IConnector } from './interfaces';

@injectable()
export class Connector implements IConnector {
  private sequelize: Sequelize | null = null;

  /**
   * Initialize connection
   */
  public async init({ dbName, dbUser, dbPassword, dbOptions = {} }: ConnectorOptions): Promise<void> {
    this.sequelize = await new Sequelize(dbName, dbUser, dbPassword, {
      pool: {
        max: 20,
        min: 0,
        idle: 10000,
        acquire: 50000,
      },
      ...dbOptions,
    });
    await this.testConnection();
  }

  /**
   * Test connection after initialization
   */
  public testConnection(): Promise<void> | null {
    return this.sequelize && this.sequelize.authenticate();
  }

  /**
   * Sequelize instance getter
   */
  public getConnection(): Sequelize | null {
    return this.sequelize;
  }
}
