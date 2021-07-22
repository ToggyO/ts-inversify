/**
 * Description: Sequelize schema for products table
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
    _isRequiredToShow: true,
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
    _isRequiredToShow: true,
  },
  articleType: {
    field: 'article_type',
    type: DataTypes.STRING,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  imageUrl: {
    field: 'image_url',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
    _isRequiredToShow: true,
  },
  neibhourhood: {
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
  ratingAvg: {
    field: 'rating_avg',
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 0,
    _isCreatable: true,
    _isEditable: true,
    _isRequiredToShow: true,
  },
  ratingCount: {
    field: 'rating_count',
    type: DataTypes.INTEGER,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  pricingType: {
    field: 'pricing_type',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  originalPrice: {
    field: 'original_price',
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 0,
    _isCreatable: true,
    _isEditable: true,
    _isRequiredToShow: true,
  },
  finalPrice: {
    field: 'final_price',
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 0,
    _isCreatable: true,
    _isEditable: true,
    _isRequiredToShow: true,
  },
  bestDiscount: {
    field: 'best_discount',
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 0,
    _isCreatable: true,
    _isEditable: true,
  },
  metaTitle: {
    field: 'meta_title',
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  metaAuthor: {
    field: 'meta_author',
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
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
    _isRequiredToShow: true,
  },
  langCode: {
    field: 'lang_code',
    type: DataTypes.STRING,
    defaultValue: 'en_GB',
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  isSuggested: {
    field: 'is_suggested',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
    _isRequiredToShow: true,
  },
  sourceId: {
    field: 'source_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
  },
  currency: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
  },
  cityId: {
    field: 'city_id',
    type: DataTypes.INTEGER,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  mostPopular: {
    field: 'most_popular',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    _isEditable: true,
    _isRequiredToShow: true,
  },
  topActivities: {
    field: 'top_activities',
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    _isEditable: true,
    _isRequiredToShow: true,
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
