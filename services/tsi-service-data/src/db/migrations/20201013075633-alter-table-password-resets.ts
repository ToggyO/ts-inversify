/**
 * Description: Add `id`, `status` columns on password_resets table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('password_resets', 'id', {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      });
      await queryInterface.addColumn('password_resets', 'status', {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('password_resets', 'id');
      await queryInterface.removeColumn('password_resets', 'status');
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },
};
