/**
 * Description: Layer for working with the table product media in the database
 */

import * as express from 'express';
import { DataTypes } from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('db/schemas/product/product-meta-info');

export class ProductMetaInfoModel extends BaseModel {
  public static readonly ModelName: string = 'product_meta_info';
  public static readonly TableName: string = 'product_meta_infos';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof ProductMetaInfoModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return ProductMetaInfoModel;
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
  public metaKey!: string;
  public metaKeyHtml!: string;
  public metaValue!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}
