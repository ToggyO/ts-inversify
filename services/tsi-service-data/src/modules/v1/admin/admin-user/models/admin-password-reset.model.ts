/**
 * Description: Layer for working with the admin_password_resets table in the database
 */

import * as express from 'express';
import { DataTypes } from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('db/schemas/admin/admin-password-reset');

export class AdminPasswordResetModel extends BaseModel {
  public static readonly ModelName: string = 'admin_password_reset';
  public static readonly TableName: string = 'admin_password_resets';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof AdminPasswordResetModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      // timestamps: true,
      createdAt: true,
      updatedAt: false,
    });

    return AdminPasswordResetModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public email!: string;
  public token!: string;
  public status!: number;
  public createdAt!: Date;
}
