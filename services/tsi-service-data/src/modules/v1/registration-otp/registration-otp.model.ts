/**
 * Description: Layer for working with the users table in the database
 */

import * as express from 'express';
import { DataTypes } from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('db/schemas/user/registration-otps');

export class RegistrationOtpModel extends BaseModel {
  public static readonly ModelName: string = 'registration_otp';
  public static readonly TableName: string = 'registration_otps';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof RegistrationOtpModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return RegistrationOtpModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public phoneNumber!: string;
  public otp!: string;
  public status!: number;
  public email!: string;
  public expireAt!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}
