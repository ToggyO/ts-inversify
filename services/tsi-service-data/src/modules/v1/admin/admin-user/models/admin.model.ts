/**
 * Description: Layer for working with the admins table in the database
 */

import * as express from 'express';
import { DataTypes } from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('db/schemas/admin/admin');

export class AdminModel extends BaseModel {
  public static readonly ModelName: string = 'admin';
  public static readonly TableName: string = 'admins';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof AdminModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    AdminModel.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return AdminModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public name!: string;
  public email!: string;
  public emailVerifiedAt!: string;
  public password!: string;
  public profileImage!: string;
  public phoneNumber!: string;
  public landline!: string;
  public address!: string;
  public postalCode!: string;
  public isActivated!: number;
  public rememberToken!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}
