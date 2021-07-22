/**
 * Description: Layer for working with the product_views table in the database
 */

import * as express from 'express';
import { DataTypes } from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('db/schemas/product/product-view');

export class ProductViewModel extends BaseModel {
  public static readonly ModelName: string = 'product_view';
  public static readonly TableName: string = 'product_views';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof ProductViewModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return ProductViewModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public ipAddress!: string;
  public productId!: number;
  public pageView!: number;
  public deviceType!: number;
  public utmSource!: string;
  public utmMedium!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}
