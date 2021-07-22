/**
 * Description: Layer for working with the sales_flat_order_items table in the database
 */

import * as express from 'express';
import {
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';
import { ItineraryItemModel } from '../itinerary-item';

const schema = require('../../../db/schemas/sales-flat-order/sales-flat-order-items');

export class SalesFlatOrderItemModel extends BaseModel {
  public static readonly ModelName: string = 'sales_flat_order_item';
  public static readonly TableName: string = 'sales_flat_order_items';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof SalesFlatOrderItemModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return SalesFlatOrderItemModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { ItineraryItemModel } = models;

    this.belongsTo(ItineraryItemModel, { foreignKey: 'itinerary_item_id', as: 'itineraryItems' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public orderId!: number;
  public itineraryItemId!: number;
  public orderedQty!: number;
  public invoicedQty!: number;
  public cancelledQty!: number;
  public productId!: number;
  public orgProductId!: number;
  public productName!: string;
  public variantId!: number;
  public orgVariantId!: number;
  public variantName!: string;
  public itemId!: number;
  public inventoryId!: number;
  public userType!: string;
  public productOptions!: string;
  public dateTime!: string;
  public orgUnitPrice!: number;
  public unitPrice!: number;
  public finalPrice!: number;
  public sourceId!: number;
  public langCode!: string;
  public coupanDiscountAmt!: number;
  public referralDiscountPoint!: number;
  public referralDiscountAmt!: number;
  public booked!: number;
  public bookinIn!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public getItineraryItems!: BelongsToGetAssociationMixin<ItineraryItemModel>;
  public setItineraryItems!: BelongsToSetAssociationMixin<ItineraryItemModel, number>;
  public createItineraryItems!: BelongsToCreateAssociationMixin<ItineraryItemModel>;
}
