/**
 * Description: Layer for working with the promo_codes table in the database
 */

import * as express from 'express';
import {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
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
import { STORAGE_KEYS } from 'constants/storage-keys';

import { PromoCodeUseModel } from './promo-code-use.model';

const schema = require('db/schemas/promo/promo-codes');

export class PromoCodeModel extends BaseModel {
  public static readonly ModelName: string = 'promo_code';
  public static readonly TableName: string = 'promo_codes';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof PromoCodeModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return PromoCodeModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { PromoCodeUseModel } = models;

    this.hasMany(PromoCodeUseModel, { foreignKey: 'promo_code_id', as: 'promoCodeUses' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public couponName!: string;
  public generationType!: string;
  public promoCode!: string;
  public couponQty!: number;
  public tAndC!: string;
  public couponType!: string;
  public couponValue!: number;
  public availableDays!: { data: Array<string> };
  public startDate!: string;
  public endDate!: string;
  public startTime!: string;
  public endTime!: string;
  public deviceType!: number;
  public excludeWalletPoint!: number;
  public includeApiData!: boolean;
  public userRedemptionLimit!: number;
  public remainUserRedemptionLimit!: number;
  public minCartAmount!: number;
  public usesCount!: number;
  public batchQty!: number;
  public status!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public getPromoCodeUses!: HasManyGetAssociationsMixin<PromoCodeUseModel>;
  public setPromoCodeUses!: HasManySetAssociationsMixin<PromoCodeUseModel, number>;
  public addPromoCodeUses!: HasManyAddAssociationsMixin<PromoCodeUseModel, number>;
  public addPromoCodeUse!: HasManyAddAssociationMixin<PromoCodeUseModel, number>;
  public createPromoCodeUse!: HasManyCreateAssociationMixin<PromoCodeUseModel>;
  public removePromoCodeUses!: HasManyRemoveAssociationsMixin<PromoCodeUseModel, number>;
  public removePromoCodeUse!: HasManyRemoveAssociationMixin<PromoCodeUseModel, number>;
  public hasPromoCodeUses!: HasManyHasAssociationsMixin<PromoCodeUseModel, number>;
  public hasPromoCodeUse!: HasManyHasAssociationMixin<PromoCodeUseModel, number>;
  public countPromoCodeUses!: HasManyCountAssociationsMixin;
}
