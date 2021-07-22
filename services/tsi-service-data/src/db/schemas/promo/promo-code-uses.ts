/**
 * Description: Sequelize schema for promo_code_uses table
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
  promoCodeId: {
    field: 'promo_code_id',
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  usesCount: {
    field: 'uses_count',
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
