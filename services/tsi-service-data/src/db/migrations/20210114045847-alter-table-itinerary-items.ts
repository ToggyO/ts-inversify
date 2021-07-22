/**
 * Description: Add `headoutProductId`,`productName`,`headoutVariantId`,
 * `variantName`,`headoutVariantItemId`  on itinerary_items table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'itinerary_items',
        'total_price',
        {
          field: 'total_price',
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'itinerary_items',
        'headout_product_id',
        {
          field: 'headout_product_id',
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'itinerary_items',
        'product_name',
        {
          field: 'product_name',
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'itinerary_items',
        'headout_variant_id',
        {
          field: 'headout_variant_id',
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'itinerary_items',
        'variant_name',
        {
          field: 'variant_name',
          type: DataTypes.STRING,
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'itinerary_items',
        'headout_variant_item_id',
        {
          field: 'headout_variant_item_id',
          type: DataTypes.BIGINT,
          allowNull: false,
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
      await queryInterface.removeColumn('itinerary_items', 'total_price', { transaction });
      await queryInterface.removeColumn('itinerary_items', 'headout_product_id', { transaction });
      await queryInterface.removeColumn('itinerary_items', 'product_name', { transaction });
      await queryInterface.removeColumn('itinerary_items', 'headout_variant_id', { transaction });
      await queryInterface.removeColumn('itinerary_items', 'variant_name', { transaction });
      await queryInterface.removeColumn('itinerary_items', 'headout_variant_item_id', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },
};
