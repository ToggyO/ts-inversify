/**
 * Description: Sequelize schema for itinerary_items table
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
  itineraryId: {
    field: 'itinerary_id',
    type: DataTypes.INTEGER,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  productId: {
    field: 'product_id',
    type: DataTypes.INTEGER,
    allowNull: true,
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
  position: {
    type: DataTypes.STRING,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
    _isHidden: true,
  },
  itineraryDate: {
    field: 'itinerary_date',
    type: DataTypes.DATE,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  dateTime: {
    field: 'date_time',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  variantId: {
    field: 'variant_id',
    type: DataTypes.INTEGER,
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
  variantItemId: {
    field: 'variant_item_id',
    type: DataTypes.INTEGER,
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
  totalPrice: {
    field: 'total_price',
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
    get() {
      return parseFloat(this.getDataValue('totalPrice'));
    },
  },
  productOptions: {
    field: 'product_options',
    type: DataTypes.TEXT,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  isExcluded: {
    field: 'is_excluded',
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  isBooked: {
    field: 'is_booked',
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  source: {
    type: DataTypes.TINYINT,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
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
  ratingCommentId: {
    field: 'rating_comment_id',
    type: DataTypes.INTEGER,
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
});

module.exports = schema;
