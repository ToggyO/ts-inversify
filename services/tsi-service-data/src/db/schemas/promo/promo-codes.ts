/**
 * Description: Sequelize schema for promo_codes table
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
  couponName: {
    field: 'coupon_name',
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  generationType: {
    field: 'generation_type',
    type: DataTypes.STRING,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  promoCode: {
    field: 'promo_code',
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  couponQty: {
    field: 'coupon_qty',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  tAndC: {
    field: 't_and_c',
    type: DataTypes.TEXT,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  couponType: {
    field: 'coupon_type',
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  couponValue: {
    field: 'coupon_value',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  availableDays: {
    field: 'available_days',
    type: DataTypes.TEXT,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  startDate: {
    field: 'start_date',
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  endDate: {
    field: 'end_date',
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  startTime: {
    field: 'start_time',
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  endTime: {
    field: 'end_time',
    type: DataTypes.STRING,
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
  excludeWalletPoint: {
    field: 'exclude_wallet_point',
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
  },
  includeApiData: {
    field: 'include_api_data',
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
    _isEditable: true,
    _isCreatable: true,
  },
  userRedemptionLimit: {
    field: 'user_redemption_limit',
    type: DataTypes.TINYINT,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  remainUserRedemptionLimit: {
    field: 'remain_user_redemption_limit',
    type: DataTypes.TINYINT,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  minCartAmount: {
    field: 'min_cart_amount',
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    defaultValue: '0.00',
    _isEditable: true,
    _isCreatable: true,
  },
  usesCount: {
    field: 'uses_count',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    _isEditable: true,
    _isCreatable: true,
  },
  batchQty: {
    field: 'batch_qty',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    _isEditable: true,
    _isCreatable: true,
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
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
