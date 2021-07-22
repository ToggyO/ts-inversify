/**
 * Description: Sequelize schema for sales_flat_orders_items table
 */

import { Sequelize } from 'sequelize';

import { CustomModelAttributes, SequelizeDataTypes } from 'db/interfaces';

/**
 * Sequelize schema export
 */
const schema = (sequelize: Sequelize, DataTypes: SequelizeDataTypes): CustomModelAttributes => ({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    field: 'order_id',
    type: DataTypes.BIGINT,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  itineraryItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  orderedQty: {
    field: 'ordered_qty',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  invoicedQty: {
    field: 'invoiced_qty',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  cancelledQty: {
    field: 'cancelled_qty',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  productId: {
    field: 'product_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  orgProductId: {
    field: 'org_product_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  productName: {
    field: 'product_name',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  variantId: {
    field: 'variant_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  orgVariantId: {
    field: 'orgvariant_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  variantName: {
    field: 'variant_name',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  itemId: {
    field: 'item_id',
    type: DataTypes.BIGINT,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  inventoryId: {
    field: 'inventory_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  userType: {
    field: 'user_type',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  productOptions: {
    field: 'product_options',
    type: DataTypes.TEXT,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  dateTime: {
    field: 'date_time',
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  orgUnitPrice: {
    field: 'org_unit_price',
    type: DataTypes.DECIMAL,
    defaultValue: '0.00',
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  unitPrice: {
    field: 'unit_price',
    type: DataTypes.DECIMAL,
    defaultValue: '0.00',
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  finalPrice: {
    field: 'final_price',
    type: DataTypes.DECIMAL,
    defaultValue: '0.00',
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  sourceId: {
    field: 'source_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
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
  coupanDiscountAmt: {
    field: 'coupan_discount_amt',
    type: DataTypes.DECIMAL,
    defaultValue: '0.00',
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  referralDiscountPoint: {
    field: 'referral_discount_point',
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  referralDiscountAmt: {
    field: 'referral_discount_amt',
    type: DataTypes.DECIMAL,
    defaultValue: '0.00',
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  booked: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
  },
  bookinIn: {
    field: 'bookin_in',
    type: DataTypes.STRING,
    allowNull: true,
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
