/**
 * Description: Add `time` column on sales_flat_order_items_meta table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    // await queryInterface.addColumn('sales_flat_order_items_meta', 'time', {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // });
  },

  down: async (queryInterface: QueryInterface) => {
    // await queryInterface.removeColumn('sales_flat_order_items_meta', 'time');
  },
};
