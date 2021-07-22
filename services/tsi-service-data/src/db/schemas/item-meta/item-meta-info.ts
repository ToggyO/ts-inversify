/**
 * Description: Sequelize schema for item_meta_infos table
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
  metaKey: {
    field: 'meta_key',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
  },
  metaValue: {
    field: 'meta_value',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
});

module.exports = schema;
