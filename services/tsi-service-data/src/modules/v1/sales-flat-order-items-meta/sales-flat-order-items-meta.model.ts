/**
 * Description: Layer for working with the sales_flat_order_items_meta table in the database
 */

import * as express from 'express';
import { DataTypes } from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('../../../db/schemas/sales-flat-order/sales-flat-order-items-meta');

export class SalesFlatOrderItemsMetaModel extends BaseModel {
  public static readonly ModelName: string = 'sales_flat_order_items_meta';
  public static readonly TableName: string = 'sales_flat_order_items_meta';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof SalesFlatOrderItemsMetaModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return SalesFlatOrderItemsMetaModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public headoutProductId!: number;
  public productName!: string;
  public headoutVariantId!: number;
  public variantName!: string;
  public headoutVariantItemId!: number;
  public productOptions!: string;
  public product_options!: string;
  public isBooked!: number;
  public bookingId!: string;
  public inputFieldsId!: string;
  public inputFieldsLevel!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}
