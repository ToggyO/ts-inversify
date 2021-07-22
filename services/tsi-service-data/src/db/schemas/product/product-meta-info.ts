/**
 * Description: Sequelize schema for product_meta_info table
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
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  metaKey: {
    field: 'meta_key',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  metaKeyHtml: {
    field: 'meta_key_html',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  metaValue: {
    field: 'meta_value',
    type: DataTypes.TEXT,
    allowNull: true,
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
