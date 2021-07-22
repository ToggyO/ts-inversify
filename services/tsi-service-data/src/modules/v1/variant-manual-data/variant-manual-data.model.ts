/**
 * Description: Layer for working with the variant_manual_datas table in the database
 */

import * as express from 'express';
import {
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  BelongsTo,
} from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';
import { ProductModel } from 'modules/v1/product';

const schema = require('../../../db/schemas/variant/variant-manual-datas');

export class VariantManualDataModel extends BaseModel {
  public static readonly ModelName: string = 'variant_manual_data';
  public static readonly TableName: string = 'variant_manual_datas';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof VariantManualDataModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: false,
    });

    return VariantManualDataModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { ProductModel } = models;

    this.belongsTo(ProductModel, { foreignKey: 'product_id', as: 'product' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   id: number;
   */
  public id!: number;
  public productId!: number;
  public data!: string;
  public product?: ProductModel;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public getProduct!: BelongsToGetAssociationMixin<ProductModel>;
  public setProduct!: BelongsToSetAssociationMixin<ProductModel, number>;
  public createProduct!: BelongsToCreateAssociationMixin<ProductModel>;
}
