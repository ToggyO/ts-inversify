/**
 * Description: Layer for working with the product_details table in the database
 */

import * as express from 'express';
import {
  DataTypes,
  ModelCtor,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
} from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { ProductModel } from 'modules/v1/product/product.model';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('db/schemas/product/product-detail');

export class ProductDetailModel extends BaseModel {
  public static readonly ModelName: string = 'product_detail';
  public static readonly TableName: string = 'product_details';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof ProductDetailModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return ProductDetailModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { ProductModel } = models;

    this.belongsTo(ProductModel);

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public productId!: number;
  public displayTags!: string;
  public startLatitude!: number;
  public startLongitude!: number;
  public startAddressLine1!: string;
  public startAddressLine2!: string;
  public startCity!: string;
  public startPostalCode!: string;
  public startCountry!: string;
  public endLatitude!: string;
  public endLongitude!: string;
  public endAddressLine1!: string;
  public endAddressLine2!: string;
  public endCity!: string;
  public endPostalCode!: string;
  public endCountry!: string;
  public productType!: string;
  public hasInstantConfirmation!: number;
  public hasMobileTicket!: number;
  public hasAudioAvailable!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public static getProduct: BelongsToGetAssociationMixin<ProductModel>;
  public static setProduct: BelongsToSetAssociationMixin<ProductModel, number>;
  public static createProduct: BelongsToCreateAssociationMixin<ProductModel>;
}
