/**
 * Description: Sequelize schema for e_tickets table
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
  productId: {
    field: 'product_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  eTicketId: {
    field: 'e_ticket_id',
    type: DataTypes.STRING,
    allowNull: false,
    _isCreatable: true,
    _isEditable: true,
  },
  orderId: {
    field: 'order_id',
    type: DataTypes.BIGINT,
    allowNull: true,
    _isCreatable: true,
    _isEditable: true,
  },
  ticketSent: {
    field: 'ticket_sent',
    type: DataTypes.INTEGER,
    allowNull: false,
    _isEditable: true,
    _isCreatable: true,
  },
  day: {
    type: DataTypes.TEXT,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  timeSlot: {
    field: 'time_slot',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    _isEditable: true,
    _isCreatable: true,
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
