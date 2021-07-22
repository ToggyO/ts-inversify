/**
 * Description: Sequelize schema for categories table
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
  categoryId: {
    field: 'category_id',
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
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
  status: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1,
    _isEditable: true,
    _isCreatable: true,
  },
  canonicalUrl: {
    field: 'canonical_url',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  metaKeyword: {
    field: 'meta_keyword',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
    _isHidden: true,
  },
  metaDescription: {
    field: 'meta_description',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
    _isHidden: true,
  },
  langCode: {
    field: 'lang_code',
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'en_GB',
    _isCreatable: true,
    _isEditable: true,
  },
  sourceId: {
    field: 'source_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
    _isHidden: true,
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
    _isHidden: true,
  },
});

module.exports = schema;
