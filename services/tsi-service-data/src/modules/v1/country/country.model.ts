/**
 * Description: Layer for working with the countries table in the database
 */

import * as express from 'express';
import {
  DataTypes,
  // ModelCtor,
  // HasManyAddAssociationMixin,
  // HasManyAddAssociationsMixin,
  // HasManyCountAssociationsMixin,
  // HasManyCreateAssociationMixin,
  // HasManyGetAssociationsMixin,
  // HasManyHasAssociationMixin,
  // HasManyHasAssociationsMixin,
  // HasManyRemoveAssociationMixin,
  // HasManyRemoveAssociationsMixin,
  // HasManySetAssociationsMixin,
} from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
// import { UserModel } from 'modules/v1/user/user.model';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('db/schemas/country/country');

export class CountryModel extends BaseModel {
  public static readonly ModelName: string = 'country';
  public static readonly TableName: string = 'countries';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof CountryModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return CountryModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    // const { UserModel } = models;

    // this.hasMany(UserModel, { foreignKey: 'country_id', as: 'cityUsers' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public name!: string;
  public code!: string;
  public dialCode!: string;
  public currencyName!: string;
  public currencySymbol!: string;
  public currencyCode!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  // public getCityUsers!: HasManyGetAssociationsMixin<UserModel>;
  // public setCityUsers!: HasManySetAssociationsMixin<UserModel, number>;
  // public addCityUsers!: HasManyAddAssociationsMixin<UserModel, number>;
  // public addCityUser!: HasManyAddAssociationMixin<UserModel, number>;
  // public createCityUser!: HasManyCreateAssociationMixin<UserModel>;
  // public removeCityUsers!: HasManyRemoveAssociationsMixin<UserModel, number>;
  // public removeCityUser!: HasManyRemoveAssociationMixin<UserModel, number>;
  // public hasCityUsers!: HasManyHasAssociationsMixin<UserModel, number>;
  // public hasCityUser!: HasManyHasAssociationMixin<UserModel, number>;
  // public countCityUsers!: HasManyCountAssociationsMixin;
}
