/**
 * Description: Layer for working with the variants table in the database
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

import { ProductModel } from '../product/product.model';
import { ItineraryItemModel } from '../itinerary-item/itinerary-item.model';
import { VariantItemModel } from '../variant-item/variant-item.model';
import { SalesFlatOrderItemModel } from '../sales-flat-order-item/sales-flat-order-item.model';

const schema = require('db/schemas/variant/variant');

export class VariantModel extends BaseModel {
  public static readonly ModelName: string = 'variant';
  public static readonly TableName: string = 'variants';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof VariantModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return VariantModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { ProductModel, VariantItemModel, ItineraryItemModel, SalesFlatOrderItemModel } = models;

    this.belongsTo(ProductModel, { foreignKey: 'product_id', as: 'variantsBelongsToProduct' });
    this.hasMany(VariantItemModel, { foreignKey: 'variant_id', as: 'variantItemsOfVariants' });
    // this.hasOne(ItineraryItemModel, { foreignKey: 'variant_id', as: 'itineraryItemOfVariants' });
    this.hasMany(SalesFlatOrderItemModel, { foreignKey: 'variant_id', as: 'orderItems' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public variantId!: number;
  public productId!: number;
  public name!: string;
  public description!: string;
  public duration!: string;
  public invetoryType!: string;
  public paxMin!: number;
  public paxMax!: number;
  public cashbackValue!: number;
  public cashbackType!: string;
  public ticketDeliveryInfo!: string;
  public inputFieldsId!: string;
  public inputFieldsLevel!: string;
  public canonicalUrl!: string;
  public metaKeyword!: string;
  public metaDescription!: string;
  public status!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public variantItemsOfVariants?: Array<VariantItemModel>;
  public variantItem?: VariantItemModel;
  public variantDates?: Array<string>;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public getVariantsBelongsToProduct!: HasOneGetAssociationMixin<ProductModel>;
  public setVariantsBelongsToProduct!: HasOneSetAssociationMixin<ProductModel, number>;
  public createVariantsBelongsToProduct!: HasOneCreateAssociationMixin<ProductModel>;

  public getVariantItemsOfVariants!: HasManyGetAssociationsMixin<VariantItemModel>;
  public setVariantItemsOfVariants!: HasManySetAssociationsMixin<VariantItemModel, number>;
  public addVariantItemsOfVariants!: HasManyAddAssociationsMixin<VariantItemModel, number>;
  public addVariantItemsOfVariant!: HasManyAddAssociationMixin<VariantItemModel, number>;
  public createVariantItemsOfVariant!: HasManyCreateAssociationMixin<VariantItemModel>;
  public removeVariantItemsOfVariants!: HasManyRemoveAssociationsMixin<VariantItemModel, number>;
  public removeVariantItemsOfVariant!: HasManyRemoveAssociationMixin<VariantItemModel, number>;
  public hasVariantItemsOfVariants!: HasManyHasAssociationsMixin<VariantItemModel, number>;
  public hasVariantItemsOfVariant!: HasManyHasAssociationMixin<VariantItemModel, number>;
  public countVariantItemsOfVariants!: HasManyCountAssociationsMixin;

  public getItineraryItemOfVariants!: HasOneGetAssociationMixin<ItineraryItemModel>;
  public setItineraryItemOfVariants!: HasOneSetAssociationMixin<ItineraryItemModel, number>;
  public createItineraryItemOfVariants!: HasOneCreateAssociationMixin<ItineraryItemModel>;

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
}
