/**
 * Description: Sequelize schema for favourite_products table
 */

import { Sequelize } from 'sequelize';

import { CustomModelAttributes, SequelizeDataTypes } from '../../interfaces';

/**
 * Sequelize schema export
 */
const schema = (sequelize: Sequelize, DataTypes: SequelizeDataTypes): CustomModelAttributes => ({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  deviceType: {
    field: 'device_type',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  tokenId: {
    field: 'token_id',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  userId: {
    field: 'user_id',
    type: DataTypes.INTEGER,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  productId: {
    field: 'product_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  utmSource: {
    field: 'utm_source',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  utmMedium: {
    field: 'utm_medium',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
});

module.exports = schema;
