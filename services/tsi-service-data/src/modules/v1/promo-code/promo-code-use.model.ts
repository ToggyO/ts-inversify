/**
 * Description: Layer for working with the promo_code_uses table in the database
 */

import * as express from 'express';
import { DataTypes } from 'sequelize';

import { IConnector } from 'db/interfaces';
import { DbModels } from 'db/context';
import { BaseModel } from 'modules/common';
import { STORAGE_KEYS } from 'constants/storage-keys';

const schema = require('db/schemas/promo/promo-code-uses');

export class PromoCodeUseModel extends BaseModel {
  public static readonly ModelName: string = 'promo_code_use';
  public static readonly TableName: string = 'promo_code_uses';
  public static Models: DbModels;

  public static prepareInit(app: express.Application): typeof PromoCodeUseModel {
    const db: IConnector = app.get(STORAGE_KEYS.DB);
    const sequelize = db.getConnection();

    this.init(schema(sequelize, DataTypes), {
      sequelize: sequelize!,
      modelName: this.ModelName,
      tableName: this.TableName,
      timestamps: true,
    });

    return PromoCodeUseModel;
  }

  public static onAllModelsInitialized(models: DbModels): void {
    this.Models = models;
  }

  /**
   * Model attributes.
   * @see https://sequelize.org/master/manual/typescript.html
   */
  public id!: number;
  public userId: number;
  public guestId: number;
  public promoCodeId: number;
  public usesCount: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}
