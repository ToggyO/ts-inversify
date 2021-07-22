/**
 * Description: Sequelize schema for itineraries table
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
  deviceType: {
    field: 'device_type',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  tokenId: {
    field: 'token_id',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  userId: {
    field: 'user_id',
    type: DataTypes.INTEGER,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
    _isHidden: true,
  },
  guestId: {
    field: 'guest_id',
    type: DataTypes.INTEGER,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
    _isHidden: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  searchLatitude: {
    field: 'search_latitude',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  searchLongitude: {
    field: 'search_longitude',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  startLatitude: {
    field: 'start_latitude',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  startLongitude: {
    field: 'start_longitude',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  endLatitude: {
    field: 'end_latitude',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  endLongitude: {
    field: 'end_longitude',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  status: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
    _isCreatable: true,
    _isEditable: true,
  },
  visibility: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1,
    _isCreatable: true,
    _isEditable: true,
  },
  expireAt: {
    field: 'expire_at',
    type: DataTypes.DATE,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  itineraryRating: {
    field: 'itinerary_rating',
    type: DataTypes.DECIMAL,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  isVisited: {
    field: 'is_visited',
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    _isCreatable: true,
    _isEditable: true,
  },
  isBooked: {
    field: 'is_booked',
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    _isCreatable: true,
    _isEditable: true,
  },
  utmSource: {
    field: 'utm_source',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  utmMedium: {
    field: 'utm_medium',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
    _isRequiredToShow: true,
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
    _isRequiredToShow: true,
  },
});

module.exports = schema;
