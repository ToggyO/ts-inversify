/**
 * Description: Add foreign key for `order_id` column on sales_flat_order_items_meta table
 */

import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    await queryInterface.addConstraint('sales_flat_order_items_meta', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'sales_flat_order_items_meta_order_id_foreign',
      references: {
        table: 'sales_flat_orders',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeConstraint(
      'sales_flat_order_items_meta',
      'sales_flat_order_items_meta_order_id_foreign',
    );
  },
};
