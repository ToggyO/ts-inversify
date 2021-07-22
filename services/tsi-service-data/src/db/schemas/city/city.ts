/**
 * Description: Sequelize schema for cities table
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
    _isHidden: true,
  },
  topDestination: {
    field: 'top_destination',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    _isEditable: true,
  },
  topToVisit: {
    field: 'top_to_visit',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    _isEditable: true,
  },
  imageUrl: {
    field: 'image_url',
    type: DataTypes.STRING,
    allowNull: true,
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
