/**
 * Description: Layer for working with the itineraries table in the database
 */

import * as express from 'express';
import {
  DataTypes,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
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

import { ItineraryItemModel } from '../itinerary-item/itinerary-item.model';
import { UserModel } from '../user/user.model';

const schema = require('../../../db/schemas/itinerary/itinerary');

export class ItineraryModel extends BaseModel {
  public static readonly ModelName: string = 'itinerary';
  public static readonly TableName: string = 'itineraries';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof ItineraryModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return ItineraryModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { UserModel, ItineraryItemModel } = models;

    this.hasMany(ItineraryItemModel, {
      foreignKey: 'itinerary_id',
      as: 'itemsOfItineraries',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    this.belongsTo(UserModel, { foreignKey: 'user_id', as: 'userByItinerary' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public deviceType!: number;
  public tokenId!: string;
  public userId!: number;
  public guestId!: string;
  public name!: string;
  public searchLatitude!: string;
  public searchLongitude!: string;
  public startLatitude!: string;
  public startLongitude!: string;
  public endLatitude!: string;
  public endLongitude!: string;
  public status!: number;
  public visibility!: number;
  // public itineraryDate!: Date;
  public itineraryRating!: number;
  public isVisited!: number;
  public isBooked!: number;
  public utmSource!: string;
  public utmMedium!: string;
  public expireAt: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
  public itemsOfItineraries?: Array<ItineraryItemModel>;
  public userByItinerary?: UserModel;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public getItemsOfItineraries!: HasManyGetAssociationsMixin<ItineraryItemModel>;
  public setItemsOfItineraries!: HasManySetAssociationsMixin<ItineraryItemModel, number>;
  public addItemsOfItineraries!: HasManyAddAssociationsMixin<ItineraryItemModel, number>;
  public addItemsOfItinerary!: HasManyAddAssociationMixin<ItineraryItemModel, number>;
  public createItemsOfItinerary!: HasManyCreateAssociationMixin<ItineraryItemModel>;
  public removeItemsOfItineraries!: HasManyRemoveAssociationsMixin<ItineraryItemModel, number>;
  public removeItemsOfItinerary!: HasManyRemoveAssociationMixin<ItineraryItemModel, number>;
  public hasItemsOfItineraries!: HasManyHasAssociationsMixin<ItineraryItemModel, number>;
  public hasItemsOfItinerary!: HasManyHasAssociationMixin<ItineraryItemModel, number>;
  public countItemsOfItineraries!: HasManyCountAssociationsMixin;

  public getUserByItinerary!: HasOneGetAssociationMixin<UserModel>;
  public setUserByItinerary!: HasOneSetAssociationMixin<UserModel, number>;
  public createUserByItinerary!: HasOneCreateAssociationMixin<UserModel>;
}
