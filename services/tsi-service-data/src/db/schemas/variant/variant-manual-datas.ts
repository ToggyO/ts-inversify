/**
 * Description: Sequelize schema for variant_manual_datas table
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
    type: DataTypes.BIGINT,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  data: {
    type: DataTypes.TEXT,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
});

module.exports = schema;
