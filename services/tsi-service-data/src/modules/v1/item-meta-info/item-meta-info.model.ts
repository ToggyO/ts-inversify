/**
 * Description: Layer for working with the item_meta_infos table in the database
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

import { VariantItemModel } from '../variant-item/variant-item.model';
import { AgeGroup } from '../product';

const schema = require('db/schemas/item-meta/item-meta-info');

export class ItemMetaInfoModel extends BaseModel {
  public static readonly ModelName: string = 'item_meta_info';
  public static readonly TableName: string = 'item_meta_infos';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof ItemMetaInfoModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize!, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: false,
    });

    return ItemMetaInfoModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    const { VariantItemModel } = models;

    this.belongsTo(VariantItemModel, { foreignKey: 'item_id', as: 'variantItem' });

    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id: number;
  public itemId: number;
  public metaKey: string;
  public metaValue: Array<AgeGroup>;
  public variantItem?: VariantItemModel;

  /**
   * Associations virtual methods.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public createVariantItem!: BelongsToGetAssociationMixin<VariantItemModel>;
  public getVariantItem!: BelongsToSetAssociationMixin<VariantItemModel, number>;
  public setVariantItem!: BelongsToCreateAssociationMixin<VariantItemModel>;
}
