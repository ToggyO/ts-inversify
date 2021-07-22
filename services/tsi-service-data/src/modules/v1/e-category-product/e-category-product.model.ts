/**
 * Description: Layer for working with the users table in the database
 */

import * as express from 'express';
import { DataTypes } from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('db/schemas/categories/e-category-product');

export class ECategoryProductModel extends BaseModel {
  public static readonly ModelName: string = 'e_category_products';
  public static readonly TableName: string = 'e_category_products';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof ECategoryProductModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    ECategoryProductModel.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: false,
    });

    return ECategoryProductModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public eCategoryId!: number;
  public productId!: number;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
}
