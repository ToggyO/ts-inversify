/**
 * Description: Layer for working with the sales_flat_order_payments table in the database
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

import { SalesFlatOrderModel } from '../sales-flat-order/sales-flat-order.model';

const schema = require('../../../db/schemas/sales-flat-order/sales-flat-order-payment');

export class SalesFlatOrderPaymentModel extends BaseModel {
  public static readonly ModelName: string = 'sales_flat_order_payment';
  public static readonly TableName: string = 'sales_flat_order_payments';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof SalesFlatOrderPaymentModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return SalesFlatOrderPaymentModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { SalesFlatOrderModel } = models;

    this.belongsTo(SalesFlatOrderModel, { foreignKey: 'order_id', as: 'orderByPayment' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public orderId!: number;
  public status!: number;
  public transactionId!: string;
  public referenceId!: string;
  public reason!: string;
  public totalPaid!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public getOrderByPayment!: BelongsToGetAssociationMixin<SalesFlatOrderModel>;
  public setOrderByPayment!: BelongsToSetAssociationMixin<SalesFlatOrderModel, number>;
  public createOrderByPayment!: BelongsToCreateAssociationMixin<SalesFlatOrderModel>;
}
