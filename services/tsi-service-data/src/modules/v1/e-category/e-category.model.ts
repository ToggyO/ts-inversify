/**
 * Description: Layer for working with the e_categories table in the database
 */

import * as express from 'express';
import {
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
} from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('db/schemas/categories/e-category');

export class ECategoryModel extends BaseModel {
  public static readonly ModelName: string = 'e_category';
  public static readonly TableName: string = 'e_categories';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof ECategoryModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    ECategoryModel.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return ECategoryModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { ProductModel, ECategoryProductModel } = models;

    this.belongsToMany(ProductModel, {
      through: ECategoryProductModel,
      as: 'productsOfCategories',
    });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public name!: string;
  public description!: string;
  public imageUrl!: string;
  public status!: number;
  public metaKeyword!: string;
  public metaDescription!: string;
  public position!: number;
  public slug!: string;
  public langCode!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  // public getCityOfUser!: BelongsToGetAssociationMixin<CountryModel>;
  // public setCityOfUser!: BelongsToSetAssociationMixin<CountryModel, number>;
  // public createCityOfUser!: BelongsToCreateAssociationMixin<CountryModel>;

  // public getUserFavouriteProducts!: HasManyGetAssociationsMixin<ProductModel>;
  // public setUserFavouriteProducts!: HasManySetAssociationsMixin<ProductModel, number>;
  // public addUserFavouriteProducts!: HasManyAddAssociationsMixin<ProductModel, number>;
  // public addUserFavouriteProduct!: HasManyAddAssociationMixin<ProductModel, number>;
  // public createUserFavouriteProduct!: HasManyCreateAssociationMixin<ProductModel>;
  // public removeUserFavouriteProducts!: HasManyRemoveAssociationsMixin<ProductModel, number>;
  // public removeUserFavouriteProduct!: HasManyRemoveAssociationMixin<ProductModel, number>;
  // public hasUserFavouriteProducts!: HasManyHasAssociationsMixin<ProductModel, number>;
  // public hasUserFavouriteProduct!: HasManyHasAssociationMixin<ProductModel, number>;
  // public countUserFavouriteProducts!: HasManyCountAssociationsMixin;

  // public getItinerariesOfUsers!: HasManyGetAssociationsMixin<ItineraryItemModel>;
  // public setItinerariesOfUsers!: HasManySetAssociationsMixin<ItineraryItemModel, number>;
  // public addItinerariesOfUsers!: HasManyAddAssociationsMixin<ItineraryItemModel, number>;
  // public addItinerariesOfUser!: HasManyAddAssociationMixin<ItineraryItemModel, number>;
  // public createItinerariesOfUser!: HasManyCreateAssociationMixin<ItineraryItemModel>;
  // public removeItinerariesOfUsers!: HasManyRemoveAssociationsMixin<ItineraryItemModel, number>;
  // public removeItinerariesOfUser!: HasManyRemoveAssociationMixin<ItineraryItemModel, number>;
  // public hasItinerariesOfUsers!: HasManyHasAssociationsMixin<ItineraryItemModel, number>;
  // public hasItinerariesOfUser!: HasManyHasAssociationMixin<ItineraryItemModel, number>;
  // public countItinerariesOfUsers!: HasManyCountAssociationsMixin;
}
