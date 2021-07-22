/**
 * Description: Sequelize schema for countries table
 */

import { Sequelize } from 'sequelize';

import { CustomModelAttributes, SequelizeDataTypes } from 'db/interfaces';

/**
 * Sequelize schema export
 */
const schema = (sequelize: Sequelize, DataTypes: SequelizeDataTypes): CustomModelAttributes => ({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  dialCode: {
    field: 'dial_code',
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  currencyName: {
    field: 'currency_name',
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  currencySymbol: {
    field: 'currency_symbol',
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  currencyCode: {
    field: 'currency_code',
    type: DataTypes.STRING,
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
