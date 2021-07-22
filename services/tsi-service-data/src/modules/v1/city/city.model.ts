/**
 * Description: Layer for working with the cities table in the database
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
import { ProductModel } from 'modules/v1/product/product.model';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('db/schemas/city/city');

export class CityModel extends BaseModel {
  public static readonly ModelName: string = 'city';
  public static readonly TableName: string = 'cities';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof CityModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return CityModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { ProductModel } = models;

    this.hasMany(ProductModel, { foreignKey: 'city_id', as: 'products' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public name!: string;
  public code!: string;
  public top!: boolean;
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
