/**
 * Description: Layer for working with the product_ratings table in the database
 */

import * as express from 'express';
import {
  DataTypes,
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
import { ProductRatingCommentModel } from 'modules/v1/product-rating-comment/product-rating-comment.model';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('db/schemas/product/product-rating');

export class ProductRatingModel extends BaseModel {
  public static readonly ModelName: string = 'product_rating';
  public static readonly TableName: string = 'product_ratings';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof ProductRatingModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return ProductRatingModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { ProductRatingCommentModel } = models;

    this.hasMany(ProductRatingCommentModel, { foreignKey: 'rating_id', as: 'productRatingComments' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public userId!: number;
  public productId!: number;
  public avgRating!: number;
  public ratingCount!: number;
  public deviceType!: number;
  public comment!: string;
  public attachments!: string;
  public status!: number;
  public utmSource!: number;
  public utmMedium!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public getProductRatingComments!: HasManyGetAssociationsMixin<ProductRatingCommentModel>;
  public setProductRatingComments!: HasManySetAssociationsMixin<ProductRatingCommentModel, number>;
  public addProductRatingComments!: HasManyAddAssociationsMixin<ProductRatingCommentModel, number>;
  public addProductRatingComment!: HasManyAddAssociationMixin<ProductRatingCommentModel, number>;
  public createProductRatingComment!: HasManyCreateAssociationMixin<ProductRatingCommentModel>;
  public removeProductRatingComments!: HasManyRemoveAssociationsMixin<ProductRatingCommentModel, number>;
  public removeProductRatingComment!: HasManyRemoveAssociationMixin<ProductRatingCommentModel, number>;
  public hasProductRatingComments!: HasManyHasAssociationsMixin<ProductRatingCommentModel, number>;
  public hasProductRatingComment!: HasManyHasAssociationMixin<ProductRatingCommentModel, number>;
  public countProductRatingComments!: HasManyCountAssociationsMixin;
}
