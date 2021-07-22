/**
 * Description: Layer for working with the users table in the database
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
import { Gender } from 'constants/genders';
import { STORAGE_KEYS } from 'constants/storage-keys';

import { CountryModel } from '../country';
import { ProductModel } from '../product';
import { ItineraryItemModel } from '../itinerary-item';

const schema = require('db/schemas/user/user');

export class UserModel extends BaseModel {
  public static readonly ModelName: string = 'user';
  public static readonly TableName: string = 'users';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof UserModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    UserModel.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return UserModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { CountryModel, ProductModel, FavouriteProductModel, ItineraryModel } = models;

    this.belongsTo(CountryModel, { foreignKey: 'country_id', as: 'countryOfUser' });
    this.belongsToMany(ProductModel, {
      through: FavouriteProductModel,
      foreignKey: 'user_id',
      as: 'userFavouriteProducts',
    });
    this.hasMany(ItineraryModel, { foreignKey: 'user_id', as: 'itinerariesOfUsers' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public referralCode!: string;
  public socialId!: string;
  public socialType!: string;
  public emailVerifiedAt!: Date;
  public phoneVerifiedAt!: Date;
  // public sentEmail!: Date;
  public reminderEmail!: number;
  public password!: string;
  public countryId!: number;
  public phoneNumber!: string;
  public isMobileRegistered!: number;
  public dob!: Date;
  public age!: number;
  public gender!: typeof Gender;
  public profileImage!: string;
  public status!: number;
  public deviceType!: string;
  public rememberToken!: string;
  public stripeCustomerToken!: string;
  // public utmSource!: string;
  // public utmMedium!: string;
  public langCode!: string;
  public isBlocked!: 0 | 1;
  public createdAt!: Date;
  public updatedAt!: Date;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public getCityOfUser!: BelongsToGetAssociationMixin<CountryModel>;
  public setCityOfUser!: BelongsToSetAssociationMixin<CountryModel, number>;
  public createCityOfUser!: BelongsToCreateAssociationMixin<CountryModel>;

  public getUserFavouriteProducts!: HasManyGetAssociationsMixin<ProductModel>;
  public setUserFavouriteProducts!: HasManySetAssociationsMixin<ProductModel, number>;
  public addUserFavouriteProducts!: HasManyAddAssociationsMixin<ProductModel, number>;
  public addUserFavouriteProduct!: HasManyAddAssociationMixin<ProductModel, number>;
  public createUserFavouriteProduct!: HasManyCreateAssociationMixin<ProductModel>;
  public removeUserFavouriteProducts!: HasManyRemoveAssociationsMixin<ProductModel, number>;
  public removeUserFavouriteProduct!: HasManyRemoveAssociationMixin<ProductModel, number>;
  public hasUserFavouriteProducts!: HasManyHasAssociationsMixin<ProductModel, number>;
  public hasUserFavouriteProduct!: HasManyHasAssociationMixin<ProductModel, number>;
  public countUserFavouriteProducts!: HasManyCountAssociationsMixin;

  public getItinerariesOfUsers!: HasManyGetAssociationsMixin<ItineraryItemModel>;
  public setItinerariesOfUsers!: HasManySetAssociationsMixin<ItineraryItemModel, number>;
  public addItinerariesOfUsers!: HasManyAddAssociationsMixin<ItineraryItemModel, number>;
  public addItinerariesOfUser!: HasManyAddAssociationMixin<ItineraryItemModel, number>;
  public createItinerariesOfUser!: HasManyCreateAssociationMixin<ItineraryItemModel>;
  public removeItinerariesOfUsers!: HasManyRemoveAssociationsMixin<ItineraryItemModel, number>;
  public removeItinerariesOfUser!: HasManyRemoveAssociationMixin<ItineraryItemModel, number>;
  public hasItinerariesOfUsers!: HasManyHasAssociationsMixin<ItineraryItemModel, number>;
  public hasItinerariesOfUser!: HasManyHasAssociationMixin<ItineraryItemModel, number>;
  public countItinerariesOfUsers!: HasManyCountAssociationsMixin;
}
