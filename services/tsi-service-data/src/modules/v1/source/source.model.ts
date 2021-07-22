/**
 * Description: Layer for working with the source table in the database
 */

import * as express from 'express';
import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
} from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

import { ProductModel } from '../product';
import { SalesFlatOrderModel } from '../sales-flat-order/sales-flat-order.model';

const schema = require('db/schemas/source/source');

export class SourceModel extends BaseModel {
  public static readonly ModelName: string = 'source';
  public static readonly TableName: string = 'sources';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof SourceModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return SourceModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { ProductModel, SalesFlatOrderModel } = models;

    this.hasMany(ProductModel, { foreignKey: 'source_id', as: 'products' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public name!: string;
  public type!: string;
  public status!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public getProducts!: HasManyGetAssociationsMixin<ProductModel>;
  public setProducts!: HasManySetAssociationsMixin<ProductModel, number>;
  public addProducts!: HasManyAddAssociationsMixin<ProductModel, number>;
  public addProduct!: HasManyAddAssociationMixin<ProductModel, number>;
  public createProduct!: HasManyCreateAssociationMixin<ProductModel>;
  public removeProducts!: HasManyRemoveAssociationsMixin<ProductModel, number>;
  public removeProduct!: HasManyRemoveAssociationMixin<ProductModel, number>;
  public hasProducts!: HasManyHasAssociationsMixin<ProductModel, number>;
  public hasProduct!: HasManyHasAssociationMixin<ProductModel, number>;
  public countProducts!: HasManyCountAssociationsMixin;
}
