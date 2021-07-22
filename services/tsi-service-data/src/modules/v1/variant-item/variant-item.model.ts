/**
 * Description: Layer for working with the variant_items table in the database
 */

import * as express from 'express';
import {
  DataTypes,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
} from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

import { ItemMetaInfoModel } from '../item-meta-info/item-meta-info.model';

const schema = require('db/schemas/variant/variant-item');

export class VariantItemModel extends BaseModel {
  public static readonly ModelName: string = 'variant_item';
  public static readonly TableName: string = 'variant_items';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof VariantItemModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return VariantItemModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { ItemMetaInfoModel } = models;

    this.hasOne(ItemMetaInfoModel, { foreignKey: 'item_id', as: 'itemMetaInfo' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   id: number;
   */
  public itemId!: number;
  public variantId!: number;
  public startDateTime!: Date;
  public endDateTime!: Date;
  public availability!: string;
  public remaining!: number;
  public status!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public itemMetaInfo?: ItemMetaInfoModel;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public createItemMetaInfo!: HasOneGetAssociationMixin<ItemMetaInfoModel>;
  public getItemMetaInfo!: HasOneSetAssociationMixin<ItemMetaInfoModel, number>;
  public setItemMetaInfo!: HasOneCreateAssociationMixin<ItemMetaInfoModel>;
}
