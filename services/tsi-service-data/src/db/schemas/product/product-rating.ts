/**
 * Description: Sequelize schema for product_ratings table
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
  userId: {
    field: 'user_id',
    type: DataTypes.INTEGER,
    allowNull: false,
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
  avgRating: {
    field: 'avg_rating',
    type: DataTypes.DECIMAL,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  ratingCount: {
    field: 'rating_count',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
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
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  attachments: {
    type: DataTypes.TEXT,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  utmSource: {
    field: 'utm_source',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  utmMedium: {
    field: 'utm_medium',
    type: DataTypes.INTEGER,
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
