/**
 * Description: Layer for working with the itinerary_items table in the database
 */

import * as express from 'express';
import {
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
} from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

import { ItineraryModel } from '../itinerary/itinerary.model';
import { ProductModel } from '../product/product.model';
import { SalesFlatOrderItemModel } from '../sales-flat-order-item/sales-flat-order-item.model';

const schema = require('../../../db/schemas/itinerary/itinerary-item');

export class ItineraryItemModel extends BaseModel {
  public static readonly ModelName: string = 'itinerary_item';
  public static readonly TableName: string = 'itinerary_items';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof ItineraryItemModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      // timestamps: true,
      createdAt: true,
      updatedAt: false,
    });

    return ItineraryItemModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { ItineraryModel, ProductModel, VariantModel, SalesFlatOrderItemModel } = models;

    this.belongsTo(ItineraryModel, { foreignKey: 'itinerary_id', as: 'itineraryOfItineraryItem' });
    this.belongsTo(ProductModel, { foreignKey: 'product_id', as: 'productOfItineraryItem' });
    // this.belongsTo(ProductRatingCommentModel, {
    //   foreignKey: 'rating_comment_id',
    //   as: 'ratingCommentOfItineraryItem',
    // });
    // this.belongsTo(VariantModel, { foreignKey: 'variant_id', as: 'variantOfItineraryItem' });
    this.hasOne(SalesFlatOrderItemModel, { foreignKey: 'itinerary_item_id', as: 'orderItems' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public itineraryId!: number;
  public productId!: number;
  public headoutProductId!: number;
  public productName!: string;
  public position!: string;
  public itineraryDate!: Date;
  public dateTime!: string;
  public variantId!: number;
  public headoutVariantId!: number;
  public variantName!: string;
  public variantItemId!: number;
  public headoutVariantItemId!: number;
  public totalPrice!: number;
  public productOptions!: string;
  public isExcluded!: number;
  public isBooked!: number;
  public source!: number;
  public deviceType!: number;
  public ratingCommentId!: number;
  public imageUrl?: string;
  public createdAt!: Date;
  // public updatedAt!: Date;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public getItineraryOfItineraryItem!: BelongsToGetAssociationMixin<ItineraryModel>;
  public setItineraryOfItineraryItem!: BelongsToSetAssociationMixin<ItineraryModel, number>;
  public createItineraryOfItineraryItem!: BelongsToCreateAssociationMixin<ItineraryModel>;

  public getVariantOfItineraryItem!: BelongsToGetAssociationMixin<ItineraryModel>;
  public setVariantOfItineraryItem!: BelongsToSetAssociationMixin<ItineraryModel, number>;
  public createVariantOfItineraryItem!: BelongsToCreateAssociationMixin<ItineraryModel>;

  public getProductOfItineraryItem!: BelongsToGetAssociationMixin<ProductModel>;
  public setProductOfItineraryItem!: BelongsToSetAssociationMixin<ProductModel, number>;
  public createProductOfItineraryItem!: BelongsToCreateAssociationMixin<ProductModel>;

  public getOrderItems!: HasOneGetAssociationMixin<SalesFlatOrderItemModel>;
  public setOrderItems!: HasOneSetAssociationMixin<SalesFlatOrderItemModel, number>;
  public createOrderItem!: HasOneCreateAssociationMixin<SalesFlatOrderItemModel>;
}
