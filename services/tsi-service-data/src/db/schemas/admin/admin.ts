/**
 * Description: Sequelize schema for admins table
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    _isEditable: true,
    _isCreatable: true,
  },
  emailVerifiedAt: {
    field: 'email_verified_at',
    type: DataTypes.DATE,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  profileImage: {
    field: 'profile_image',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  phoneNumber: {
    field: 'phone_number',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  landline: {
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  postalCode: {
    field: 'postal_code',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  isActivated: {
    field: 'is_activated',
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
  },
  rememberToken: {
    field: 'remember_token',
    type: DataTypes.STRING,
    allowNull: true,
    _isHidden: true,
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
