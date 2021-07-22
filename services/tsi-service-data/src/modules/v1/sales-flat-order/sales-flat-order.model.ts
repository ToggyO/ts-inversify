/**
 * Description: Layer for working with the sales_flat_order table in the database
 */

import * as express from 'express';
import {
  DataTypes,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
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

import { SalesFlatOrderPaymentModel } from '../sales-flat-order-payment/sales-flat-order-payment.model';
import { SalesFlatOrderItemModel } from '../sales-flat-order-item/sales-flat-order-item.model';
import { SalesFlatOrderItemsMetaModel } from '../sales-flat-order-items-meta';

const schema = require('../../../db/schemas/sales-flat-order/sales-flat-order');

export class SalesFlatOrderModel extends BaseModel {
  public static readonly ModelName: string = 'sales_flat_order';
  public static readonly TableName: string = 'sales_flat_orders';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof SalesFlatOrderModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return SalesFlatOrderModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { SalesFlatOrderPaymentModel, SalesFlatOrderItemModel, SalesFlatOrderItemsMetaModel } = models;

    this.hasOne(SalesFlatOrderPaymentModel, { foreignKey: 'order_id', as: 'orderPayment' });
    this.hasMany(SalesFlatOrderItemModel, { foreignKey: 'order_id', as: 'orderItems' });
    this.hasMany(SalesFlatOrderItemsMetaModel, { foreignKey: 'order_id', as: 'orderItemsMeta' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public userId!: number;
  public guestId!: string;
  public itineraryId!: string;
  public orderUuid!: string;
  public userName!: string;
  public userPhone!: string;
  public status!: string;
  public subTotal!: number;
  public netTotal!: number;
  public grandTotal!: number;
  public taxAmount!: number;
  public gatewayCharges!: number;
  public commissionCharges!: number;
  public discountAmount!: number;
  public couponCode!: string;
  public referalPointId!: number;
  public referralPoints!: number;
  public referaralDiscount!: number;
  public deviceType!: number;
  public ipAddress!: string;
  public currency!: string;
  public utmSource!: string;
  public utmMedium!: string;
  public bookingMsg!: string;
  public langCode!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public orderPayment?: Array<SalesFlatOrderPaymentModel>;
  public orderItems?: Array<SalesFlatOrderItemModel>;
  public orderItemsMeta?: Array<SalesFlatOrderItemsMetaModel>;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public getOrderPayment!: HasOneGetAssociationMixin<SalesFlatOrderPaymentModel>;
  public setOrderPayment!: HasOneSetAssociationMixin<SalesFlatOrderPaymentModel, number>;
  public createOrderPayment!: HasOneCreateAssociationMixin<SalesFlatOrderPaymentModel>;

  public getOrderItems!: HasManyGetAssociationsMixin<SalesFlatOrderItemModel>;
  public setOrderItems!: HasManySetAssociationsMixin<SalesFlatOrderItemModel, number>;
  public addOrderItems!: HasManyAddAssociationsMixin<SalesFlatOrderItemModel, number>;
  public addOrderItem!: HasManyAddAssociationMixin<SalesFlatOrderItemModel, number>;
  public createOrderItem!: HasManyCreateAssociationMixin<SalesFlatOrderItemModel>;
  public removeOrderItems!: HasManyRemoveAssociationsMixin<SalesFlatOrderItemModel, number>;
  public removeOrderItem!: HasManyRemoveAssociationMixin<SalesFlatOrderItemModel, number>;
  public hasOrderItems!: HasManyHasAssociationsMixin<SalesFlatOrderItemModel, number>;
  public hasOrderItem!: HasManyHasAssociationMixin<SalesFlatOrderItemModel, number>;
  public countOrderItems!: HasManyCountAssociationsMixin;

  public getOrderItemsMeta!: HasManyGetAssociationsMixin<SalesFlatOrderItemsMetaModel>;
  public setOrderItemsMeta!: HasManySetAssociationsMixin<SalesFlatOrderItemsMetaModel, number>;
  public addOrderItemsMeta!: HasManyAddAssociationsMixin<SalesFlatOrderItemsMetaModel, number>;
  public addOrderItemsMetum!: HasManyAddAssociationMixin<SalesFlatOrderItemsMetaModel, number>;
  public createOrderItemsMetum!: HasManyCreateAssociationMixin<SalesFlatOrderItemsMetaModel>;
  public removeOrderItemsMeta!: HasManyRemoveAssociationsMixin<SalesFlatOrderItemsMetaModel, number>;
  public removeOrderItemsMetum!: HasManyRemoveAssociationMixin<SalesFlatOrderItemsMetaModel, number>;
  public hasOrderItemsMeta!: HasManyHasAssociationsMixin<SalesFlatOrderItemsMetaModel, number>;
  public hasOrderItemsMetum!: HasManyHasAssociationMixin<SalesFlatOrderItemsMetaModel, number>;
  public countOrderItemsMeta!: HasManyCountAssociationsMixin;
}
