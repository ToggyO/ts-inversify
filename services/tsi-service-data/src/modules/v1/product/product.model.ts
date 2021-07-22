/**
 * Description: Layer for working with the products table in the database
 */

import * as express from 'express';
import {
  DataTypes,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
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
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
} from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

import { ProductDetailModel } from '../product-detail/product-detail.model';
import { ProductMediaModel } from '../product-media/product-media.model';
import { ProductMetaInfoModel } from '../product-meta-info/product-meta-info.model';
import { ProductRatingModel } from '../product-rating/product-rating.model';
import { ProductViewModel } from '../product-view/product-views.model';
import { CityModel } from '../city/city.model';
import { UserModel } from '../user/user.model';
import { FavouriteProductModel } from '../favourite-product/favourite-product.model';
import { SourceModel } from '../source/source.model';
import { VariantModel } from '../variant/variant.model';
import { ItineraryItemModel } from '../itinerary-item/itinerary-item.model';
import { SalesFlatOrderItemModel } from '../sales-flat-order-item/sales-flat-order-item.model';
import { ProductMetaInfoDTO } from './dto/ProductMetaInfoDTO';
import { VariantManualDataModel } from 'modules/v1/variant-manual-data/variant-manual-data.model';

const schema = require('db/schemas/product/product');

export class ProductModel extends BaseModel {
  public static readonly ModelName: string = 'product';
  public static readonly TableName: string = 'products';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof ProductModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
      indexes: [
        {
          name: 'product_name',
          unique: false,
          fields: ['name'],
        },
      ],
    });

    return ProductModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const {
      ProductDetailModel,
      ProductMediaModel,
      ProductMetaInfoModel,
      ProductRatingModel,
      ProductViewModel,
      CityModel,
      UserModel,
      FavouriteProductModel,
      SourceModel,
      VariantModel,
      ItineraryItemModel,
      ECategoryProductModel,
      ECategoryModel,
      SalesFlatOrderItemModel,
      VariantManualDataModel,
    } = models;

    this.hasOne(ProductDetailModel, { foreignKey: 'product_id', as: 'productDetails' });
    this.hasMany(ProductMediaModel, { foreignKey: 'product_id', as: 'productMedia' });
    this.hasMany(ProductMetaInfoModel, { foreignKey: 'product_id', as: 'productMetaInfos' });
    this.hasMany(ProductRatingModel, { foreignKey: 'product_id', as: 'productRatings' });
    this.hasMany(ProductViewModel, { foreignKey: 'product_id', as: 'productViews' });
    this.belongsTo(CityModel, { foreignKey: 'city_id', as: 'city' });
    this.hasOne(FavouriteProductModel, { foreignKey: 'product_id', as: 'isFavourite' });
    this.belongsToMany(UserModel, {
      through: FavouriteProductModel,
      foreignKey: 'product_id',
      as: 'usersWhoAddedToFavorites',
    });
    this.belongsTo(SourceModel, { foreignKey: 'source_id', as: 'productSource' });
    this.hasMany(VariantModel, { foreignKey: 'product_id', as: 'variantsOfProducts' });
    this.hasMany(ItineraryItemModel, { foreignKey: 'product_id', as: 'itineraryItemsOfProducts' });
    this.belongsToMany(ECategoryModel, {
      through: ECategoryProductModel,
      as: 'categoriesOfProduct',
    });
    this.hasMany(SalesFlatOrderItemModel, { foreignKey: 'product_id', as: 'orderItems' });
    this.hasMany(VariantManualDataModel, { foreignKey: 'product_id', as: 'variantManualDatas' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public productId!: number;
  public name!: string;
  public articleType!: string;
  public url!: string;
  public imageUrl!: string;
  public neighborhood!: string;
  public canonicalUrl!: string;
  public ratingAvg!: number;
  public ratingCount!: number;
  public pricingType!: string;
  public originalPrice!: number;
  public finalPrice!: number;
  public bestDiscount!: number;
  public metaTitle!: string;
  public metaAuthor!: string;
  public metaKeyword!: string;
  public metaDescription!: string;
  public slug!: string;
  public langCode!: string;
  public isSuggested!: number;
  public status!: number;
  public sourceId!: number;
  public currency!: string;
  public cityId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public productDetails?: ProductDetailModel;
  public productMedia?: Array<ProductMediaModel>;
  public productMetaInfos?: Array<ProductMetaInfoModel>;
  public metaInfo?: ProductMetaInfoDTO;
  public productRatings?: Array<ProductRatingModel>;
  public productViews?: Array<ProductViewModel>;
  public usersWhoAddedToFavorites?: Array<UserModel>;
  public isFavourite?: Record<keyof typeof UserModel, string> | boolean;
  public productSource?: Array<SourceModel>;
  public variantsOfProducts?: Array<VariantModel>;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public getProductDetails!: BelongsToGetAssociationMixin<ProductDetailModel>;
  public setProductDetails!: BelongsToSetAssociationMixin<ProductDetailModel, number>;
  public createProductDetails!: BelongsToCreateAssociationMixin<ProductDetailModel>;

  public getProductMedia!: HasManyGetAssociationsMixin<ProductMediaModel>;
  public setProductMedia!: HasManySetAssociationsMixin<ProductMediaModel, number>;
  public addProductMedia!: HasManyAddAssociationsMixin<ProductMediaModel, number>;
  public addProductMedium!: HasManyAddAssociationMixin<ProductMediaModel, number>;
  public createProductMedium!: HasManyCreateAssociationMixin<ProductMediaModel>;
  public removeProductMedia!: HasManyRemoveAssociationsMixin<ProductMediaModel, number>;
  public removeProductMedium!: HasManyRemoveAssociationMixin<ProductMediaModel, number>;
  public hasProductMedia!: HasManyHasAssociationsMixin<ProductMediaModel, number>;
  public hasProductMedium!: HasManyHasAssociationMixin<ProductMediaModel, number>;
  public countProductMedia!: HasManyCountAssociationsMixin;

  public getProductMetaInfos!: HasManyGetAssociationsMixin<ProductMetaInfoModel>;
  public setProductMetaInfos!: HasManySetAssociationsMixin<ProductMediaModel, number>;
  public addProductMetaInfos!: HasManyAddAssociationsMixin<ProductMediaModel, number>;
  public addProductMetaInfo!: HasManyAddAssociationMixin<ProductMediaModel, number>;
  public createProductMetaInfo!: HasManyCreateAssociationMixin<ProductMediaModel>;
  public removeProductMetaInfos!: HasManyRemoveAssociationsMixin<ProductMediaModel, number>;
  public removeProductMetaInfo!: HasManyRemoveAssociationMixin<ProductMediaModel, number>;
  public hasProductMetaInfos!: HasManyHasAssociationsMixin<ProductMediaModel, number>;
  public hasProductMetaInfo!: HasManyHasAssociationMixin<ProductMediaModel, number>;
  public countProductMetaInfos!: HasManyCountAssociationsMixin;

  public getProductRatings!: HasManyGetAssociationsMixin<ProductRatingModel>;
  public setProductRatings!: HasManySetAssociationsMixin<ProductRatingModel, number>;
  public addProductRatings!: HasManyAddAssociationsMixin<ProductRatingModel, number>;
  public addProductRating!: HasManyAddAssociationMixin<ProductRatingModel, number>;
  public createProductRating!: HasManyCreateAssociationMixin<ProductRatingModel>;
  public removeProductRatings!: HasManyRemoveAssociationsMixin<ProductRatingModel, number>;
  public removeProductRating!: HasManyRemoveAssociationMixin<ProductRatingModel, number>;
  public hasProductRatings!: HasManyHasAssociationsMixin<ProductRatingModel, number>;
  public hasProductRating!: HasManyHasAssociationMixin<ProductRatingModel, number>;
  public countProductRatings!: HasManyCountAssociationsMixin;

  public getProductViews!: HasManyGetAssociationsMixin<ProductViewModel>;
  public setProductViews!: HasManySetAssociationsMixin<ProductViewModel, number>;
  public addProductViews!: HasManyAddAssociationsMixin<ProductViewModel, number>;
  public addProductView!: HasManyAddAssociationMixin<ProductViewModel, number>;
  public createProductView!: HasManyCreateAssociationMixin<ProductViewModel>;
  public removeProductViews!: HasManyRemoveAssociationsMixin<ProductViewModel, number>;
  public removeProductView!: HasManyRemoveAssociationMixin<ProductViewModel, number>;
  public hasProductViews!: HasManyHasAssociationsMixin<ProductViewModel, number>;
  public hasProductView!: HasManyHasAssociationMixin<ProductViewModel, number>;
  public countProductViews!: HasManyCountAssociationsMixin;

  public static getCity: BelongsToGetAssociationMixin<CityModel>;
  public static setCity: BelongsToSetAssociationMixin<CityModel, number>;
  public static createCity: BelongsToCreateAssociationMixin<CityModel>;

  public getUsersWhoAddedToFavorites!: HasManyGetAssociationsMixin<UserModel>;
  public setUsersWhoAddedToFavorites!: HasManySetAssociationsMixin<UserModel, number>;
  public addUsersWhoAddedToFavorites!: HasManyAddAssociationsMixin<UserModel, number>;
  public addUsersWhoAddedToFavorite!: HasManyAddAssociationMixin<UserModel, number>;
  public createUsersWhoAddedToFavorite!: HasManyCreateAssociationMixin<UserModel>;
  public removeUsersWhoAddedToFavorites!: HasManyRemoveAssociationsMixin<UserModel, number>;
  public removeUsersWhoAddedToFavorite!: HasManyRemoveAssociationMixin<UserModel, number>;
  public hasUsersWhoAddedToFavorites!: HasManyHasAssociationsMixin<UserModel, number>;
  public hasUsersWhoAddedToFavorite!: HasManyHasAssociationMixin<UserModel, number>;
  public countUsersWhoAddedToFavorites!: HasManyCountAssociationsMixin;

  public getIsFavourite!: HasOneGetAssociationMixin<FavouriteProductModel>;
  public setIsFavourite!: HasOneSetAssociationMixin<FavouriteProductModel, number>;
  public createIsFavourite!: HasOneCreateAssociationMixin<FavouriteProductModel>;

  public getProductSource!: HasOneGetAssociationMixin<SourceModel>;
  public setProductSource!: HasOneSetAssociationMixin<SourceModel, number>;
  public createProductSource!: HasOneCreateAssociationMixin<SourceModel>;

  public getVariantsOfProducts!: HasManyGetAssociationsMixin<VariantModel>;
  public setVariantsOfProducts!: HasManySetAssociationsMixin<VariantModel, number>;
  public addVariantsOfProducts!: HasManyAddAssociationsMixin<VariantModel, number>;
  public addVariantsOfProduct!: HasManyAddAssociationMixin<VariantModel, number>;
  public createVariantsOfProduct!: HasManyCreateAssociationMixin<VariantModel>;
  public removeVariantsOfProducts!: HasManyRemoveAssociationsMixin<VariantModel, number>;
  public removeVariantsOfProduct!: HasManyRemoveAssociationMixin<VariantModel, number>;
  public hasVariantsOfProducts!: HasManyHasAssociationsMixin<VariantModel, number>;
  public hasVariantsOfProduct!: HasManyHasAssociationMixin<VariantModel, number>;
  public countVariantsOfProduct!: HasManyCountAssociationsMixin;

  public getItineraryItemsOfProducts!: HasManyGetAssociationsMixin<ItineraryItemModel>;
  public setItineraryItemsOfProducts!: HasManySetAssociationsMixin<ItineraryItemModel, number>;
  public addItineraryItemsOfProducts!: HasManyAddAssociationsMixin<ItineraryItemModel, number>;
  public addItineraryItemsOfProduct!: HasManyAddAssociationMixin<ItineraryItemModel, number>;
  public createItineraryItemsOfProduct!: HasManyCreateAssociationMixin<ItineraryItemModel>;
  public removeItineraryItemsOfProducts!: HasManyRemoveAssociationsMixin<ItineraryItemModel, number>;
  public removeItineraryItemsOfProduct!: HasManyRemoveAssociationMixin<ItineraryItemModel, number>;
  public hasItineraryItemsOfProducts!: HasManyHasAssociationsMixin<ItineraryItemModel, number>;
  public hasItineraryItemsOfProduct!: HasManyHasAssociationMixin<ItineraryItemModel, number>;
  public countItineraryItemsOfProducts!: HasManyCountAssociationsMixin;

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

  public getVariantManualDatas!: HasManyGetAssociationsMixin<VariantManualDataModel>;
  public setVariantManualDatas!: HasManySetAssociationsMixin<VariantManualDataModel, number>;
  public addVariantManualDatas!: HasManyAddAssociationsMixin<VariantManualDataModel, number>;
  public addVariantManualData!: HasManyAddAssociationMixin<VariantManualDataModel, number>;
  public createVariantManualData!: HasManyCreateAssociationMixin<VariantManualDataModel>;
  public removeVariantManualDatas!: HasManyRemoveAssociationsMixin<VariantManualDataModel, number>;
  public removeVariantManualData!: HasManyRemoveAssociationMixin<VariantManualDataModel, number>;
  public hasVariantManualDatas!: HasManyHasAssociationsMixin<VariantManualDataModel, number>;
  public hasVariantManualData!: HasManyHasAssociationMixin<VariantManualDataModel, number>;
  public countVariantManualDatas!: HasManyCountAssociationsMixin;
}
