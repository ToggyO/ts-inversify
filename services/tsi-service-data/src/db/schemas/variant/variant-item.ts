/**
 * Description: Sequelize schema for variant_items table
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
    _isRequiredToShow: true,
  },
  itemId: {
    field: 'item_id',
    type: DataTypes.BIGINT,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  variantId: {
    field: 'variant_id',
    type: DataTypes.BIGINT,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
    _isHidden: true,
  },
  startDateTime: {
    field: 'start_datetime',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  endDateTime: {
    field: 'end_datetime',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  availability: {
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  remaining: {
    type: DataTypes.INTEGER,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    _isCreatable: true,
    _isEditable: true,
    _isHidden: true,
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
