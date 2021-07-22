/**
 * Description: Sequelize schema for registration_opts table
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
  phoneNumber: {
    field: 'phone_number',
    type: DataTypes.STRING,
    allowNull: false,
    _isCreatable: true,
  },
  otp: {
    type: DataTypes.STRING(10),
    allowNull: false,
    _isCreatable: true,
  },
  status: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
    _isCreatable: true,
    _isEditable: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    _isCreatable: true,
  },
  expireAt: {
    field: 'expire_at',
    type: DataTypes.DATE,
    allowNull: false,
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
