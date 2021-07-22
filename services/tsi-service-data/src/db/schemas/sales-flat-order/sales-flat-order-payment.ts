/**
 * Description: Sequelize schema for sales_flat_orders_payments table
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
    type: DataTypes.INTEGER,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  transactionId: {
    field: 'transaction_id',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  referenceId: {
    field: 'reference_id',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  totalPaid: {
    field: 'total_paid',
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: '0.00',
    _isCreatable: true,
    _isEditable: true,
    get() {
      return parseFloat(this.getDataValue('totalPaid'));
    },
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
