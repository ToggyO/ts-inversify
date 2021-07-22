/**
 * Description: Add `inputFields_id`,`inputFields_level` on sales_flat_items_meta table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'sales_flat_order_items_meta',
        'inputFields_id',
        {
          field: 'inputFields_id',
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'sales_flat_order_items_meta',
        'inputFields_level',
        {
          field: 'inputFields_level',
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('sales_flat_order_items_meta', 'inputFields_id', { transaction });
      await queryInterface.removeColumn('sales_flat_order_items_meta', 'inputFields_level', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },
};
