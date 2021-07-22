/**
 * Description: Sequelize schema for events product_details
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
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  displayTags: {
    field: 'display_tags',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  startLatitude: {
    field: 'start_latitude',
    type: DataTypes.DOUBLE,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  startLongitude: {
    field: 'start_longitude',
    type: DataTypes.DOUBLE,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  startAddressLine1: {
    field: 'start_addressLine1',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  startAddressLine2: {
    field: 'start_addressLine2',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  startCity: {
    field: 'start_city',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  startPostalCode: {
    field: 'start_postal_code',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  startCountry: {
    field: 'start_country',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  endLatitude: {
    field: 'end_latitude',
    type: DataTypes.DOUBLE,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  endLongitude: {
    field: 'end_longitude',
    type: DataTypes.DOUBLE,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  endAddressLine1: {
    field: 'end_addressLine1',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  endAddressLine2: {
    field: 'end_addressLine2',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  endCity: {
    field: 'end_city',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  endPostalCode: {
    field: 'end_postal_code',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  endCountry: {
    field: 'end_country',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  productType: {
    field: 'product_type',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  hasInstantConfirmation: {
    field: 'has_instant_confirmation',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
  },
  hasMobileTicket: {
    field: 'has_mobile_ticket',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
  },
  hasAudioAvailable: {
    field: 'has_audio_available',
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
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
});

module.exports = schema;
