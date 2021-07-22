/**
 * Description: Sequelize schema for product_media table
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
  productId: {
    field: 'product_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  imageUrl: {
    field: 'image_url',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  caption: {
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  webPosition: {
    field: 'web_position',
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  mobilePosition: {
    field: 'mobile_position',
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
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
