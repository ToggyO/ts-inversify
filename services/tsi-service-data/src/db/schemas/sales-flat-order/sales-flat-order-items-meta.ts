/**
 * Description: Sequelize schema for sales_flat_order_items_meta table
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
  orderId: {
    field: 'order_id',
    type: DataTypes.BIGINT(20).UNSIGNED,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  time: {
    type: DataTypes.STRING,
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
  headoutProductId: {
    field: 'headout_product_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  productName: {
    field: 'product_name',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  headoutVariantId: {
    field: 'headout_variant_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  variantName: {
    field: 'variant_name',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  headoutVariantItemId: {
    field: 'headout_variant_item_id',
    type: DataTypes.BIGINT,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  productOptions: {
    field: 'product_options',
    type: DataTypes.TEXT,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  isBooked: {
    field: 'is_booked',
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
  },
  bookingId: {
    field: 'booking_id',
    type: DataTypes.BIGINT,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  inputFieldsId: {
    field: 'inputFields_id',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  inputFieldsLevel: {
    field: 'inputFields_level',
    type: DataTypes.STRING,
    allowNull: true,
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
