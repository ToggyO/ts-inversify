/**
 * Description: Sequelize schema for sales_flat_orders table
 */

import { Sequelize } from 'sequelize';

import { CustomModelAttributes, SequelizeDataTypes } from 'db/interfaces';
// Do not make this import as shortened
import { ORDER_STATUSES } from '../../../constants/order-statuses';

/**
 * Sequelize schema export
 */
const schema = (sequelize: Sequelize, DataTypes: SequelizeDataTypes): CustomModelAttributes => ({
  id: {
    type: DataTypes.BIGINT(20).UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    field: 'user_id',
    type: DataTypes.INTEGER,
    allowNull: true,
    _isCreatable: true,
  },
  guestId: {
    field: 'guest_id',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  itineraryId: {
    field: 'itinerary_id',
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  orderUuid: {
    field: 'order_uuid',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  userName: {
    field: 'user_name',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  userEmail: {
    field: 'user_email',
    type: DataTypes.STRING,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  userPhone: {
    field: 'user_phone',
    type: DataTypes.STRING,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  status: {
    type: DataTypes.ENUM([
      ORDER_STATUSES.INITIATED,
      ORDER_STATUSES.PROCESSING,
      ORDER_STATUSES.PENDING,
      ORDER_STATUSES.FAILED,
      ORDER_STATUSES.CONFIRMED,
    ]),
    allowNull: true,
    defaultValue: ORDER_STATUSES.INITIATED,
    _isCreatable: true,
    _isEditable: true,
  },
  subTotal: {
    field: 'sub_total',
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: '0.00',
    _isCreatable: true,
    _isEditable: true,
    get() {
      return parseFloat(this.getDataValue('subTotal'));
    },
  },
  netTotal: {
    field: 'net_total',
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: '0.00',
    _isCreatable: true,
    _isEditable: true,
    get() {
      return parseFloat(this.getDataValue('netTotal'));
    },
  },
  grandTotal: {
    field: 'grand_total',
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: '0.00',
    _isCreatable: true,
    _isEditable: true,
    get() {
      return parseFloat(this.getDataValue('grandTotal'));
    },
  },
  taxAmount: {
    field: 'tax_amount',
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: '0.00',
    _isCreatable: true,
    _isEditable: true,
    get() {
      return parseFloat(this.getDataValue('taxAmount'));
    },
  },
  gatewayCharges: {
    field: 'gateway_charges',
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: '0.00',
    _isCreatable: true,
    _isEditable: true,
    get() {
      return parseFloat(this.getDataValue('gatewayCharges'));
    },
  },
  commissionCharges: {
    field: 'commission_charges',
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: '0.00',
    _isCreatable: true,
    _isEditable: true,
    get() {
      return parseFloat(this.getDataValue('commissionCharges'));
    },
  },
  discountAmount: {
    field: 'discount_amount',
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: '0.00',
    _isCreatable: true,
    _isEditable: true,
    get() {
      return parseFloat(this.getDataValue('discountAmount'));
    },
  },
  couponCode: {
    field: 'coupon_code',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  referalPointId: {
    field: 'referal_point_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    _isCreatable: true,
    _isEditable: true,
  },
  referralPoints: {
    field: 'referral_points',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    _isCreatable: true,
    _isEditable: true,
  },
  referralDiscount: {
    field: 'referral_discount',
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: '0.00',
    _isCreatable: true,
    _isEditable: true,
    get() {
      return parseFloat(this.getDataValue('referralDiscount'));
    },
  },
  deviceType: {
    field: 'device_type',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
    _isEditable: true,
    _isCreatable: true,
  },
  ipAddress: {
    field: 'ip_address',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
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
  bookingMsg: {
    field: 'booking_msg',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  langCode: {
    field: 'lang_code',
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'en_GB',
    _isCreatable: true,
    _isEditable: true,
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
