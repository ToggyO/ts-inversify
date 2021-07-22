/**
 * Description: Layer for working with the favourite_products table in the database
 */

import * as express from 'express';
import { DataTypes } from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';
import { ProductDetailModel } from 'modules/v1/product-detail/product-detail.model';
import { ProductMediaModel } from 'modules/v1/product-media/product-media.model';
import { ProductMetaInfoModel } from 'modules/v1/product-meta-info/product-meta-info.model';
import { ProductMetaInfoDTO } from 'modules/v1/product/dto/ProductMetaInfoDTO';
import { ProductRatingModel } from 'modules/v1/product-rating/product-rating.model';
import { ProductViewModel } from 'modules/v1/product-view/product-views.model';
import { UserModel } from 'modules/v1/user';
import { SourceModel } from 'modules/v1/source/source.model';
import { VariantModel } from 'modules/v1/variant/variant.model';

const schema = require('db/schemas/favourite-product/favourite-product');

export class FavouriteProductModel extends BaseModel {
  public static readonly ModelName: string = 'favourite_product';
  public static readonly TableName: string = 'favourite_products';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof FavouriteProductModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return FavouriteProductModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
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
  public productId!: number;
  public product_id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}
