/**
 * Description: Sequelize schema for varinats table
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
    _isRequiredToShow: true,
  },
  variantId: {
    field: 'variant_id',
    type: DataTypes.BIGINT,
    allowNull: true,
    _isCreatable: true,
  },
  productId: {
    field: 'product_id',
    type: DataTypes.INTEGER,
    allowNull: true,
    _isCreatable: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  inventoryType: {
    field: 'inventoryType',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  paxMin: {
    field: 'pax_min',
    type: DataTypes.INTEGER,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  paxMax: {
    field: 'pax_max',
    type: DataTypes.INTEGER,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  cashbackValue: {
    field: 'cashback_value',
    type: DataTypes.INTEGER,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  cashbackType: {
    field: 'cashback_type',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  ticketDeliveryInfo: {
    field: 'ticket_delivery_info',
    type: DataTypes.TEXT,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
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
  canonicalUrl: {
    field: 'canonical_url',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  metaKeyword: {
    field: 'meta_keyword',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  metaDescription: {
    field: 'meta_description',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
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
