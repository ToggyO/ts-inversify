/**
 * Description: Database connection types and interfaces
 */

import { Application } from 'express';
import {
  ModelAttributes,
  Options,
  STRING,
  TEXT,
  NUMBER,
  TINYINT,
  SMALLINT,
  MEDIUMINT,
  INTEGER,
  BIGINT,
  FLOAT,
  REAL,
  DOUBLE,
  DECIMAL,
  BOOLEAN,
  TIME,
  DATE,
  DATEONLY,
  HSTORE,
  JSON,
  JSONB,
  NOW,
  BLOB,
  RANGE,
  UUID,
  UUIDV1,
  UUIDV4,
  VIRTUAL,
  ENUM,
  ARRAY,
  GEOMETRY,
  GEOGRAPHY,
  CIDR,
  INET,
  MACADDR,
  CITEXT,
  Sequelize,
} from 'sequelize';

import { IDbModels } from 'db/context';
import { IService } from '../interfaces';

declare type ConnectorOptions = {
  dbName: string;
  dbUser: string;
  dbPassword: string;
  dbOptions: Options;
};

declare interface IConnector {
  init(args: ConnectorOptions): Promise<void>;
  testConnection?(): Promise<void> | null;
  getConnection(): Sequelize | null;
}

declare interface IDatabaseConnectionService extends IService {
  readonly dbConnectionProvider: (options: ConnectorOptions) => IConnector;
}

declare interface IDbContext extends IDbModels {
  initializeModels(app: Application): void;
}

declare type CustomModelAttributes = ModelAttributes & {
  _isEditable?: boolean;
  _isCreatable?: boolean;
  _isHidden?: boolean;
  _isRequiredToShow?: boolean;
};

declare type SequelizeDataTypes = {
  STRING: STRING;
  TEXT: TEXT;
  NUMBER: NUMBER;
  TINYINT: TINYINT;
  SMALLINT: SMALLINT;
  MEDIUMINT: MEDIUMINT;
  INTEGER: INTEGER;
  BIGINT: BIGINT;
  FLOAT: FLOAT;
  REAL: REAL;
  DOUBLE: DOUBLE;
  DECIMAL: DECIMAL;
  BOOLEAN: BOOLEAN;
  TIME: TIME;
  DATE: DATE;
  DATEONLY: DATEONLY;
  HSTORE: HSTORE;
  JSON: JSON;
  JSONB: JSONB;
  NOW: NOW;
  BLOB: BLOB;
  RANGE: RANGE;
  UUID: UUID;
  UUIDV1: UUIDV1;
  UUIDV4: UUIDV4;
  VIRTUAL: VIRTUAL;
  ENUM: ENUM;
  ARRAY: ARRAY;
  GEOMETRY: GEOMETRY;
  GEOGRAPHY: GEOGRAPHY;
  CIDR: CIDR;
  INET: INET;
  MACADDR: MACADDR;
  CITEXT: CITEXT;
};
