/**
 * Description: Layer for working with the product_media table in the database
 */

import * as express from 'express';
import { DataTypes } from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('db/schemas/product/product-media');

export class ProductMediaModel extends BaseModel {
  public static readonly ModelName: string = 'product_media';
  public static readonly TableName: string = 'product_media';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof ProductMediaModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return ProductMediaModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public productId!: number;
  public imageUrl!: string;
  public caption!: string;
  public webPosition!: number;
  public mobilePosition!: number;
  public status!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}
