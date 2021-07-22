/**
 * Description: Add `id`, `status` columns on admin_password_resets table
 */

import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // FIXME:
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('admin_password_resets', 'id', {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      });
      await queryInterface.addColumn('admin_password_resets', 'status', {
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
      await queryInterface.removeColumn('admin_password_resets', 'id');
      await queryInterface.removeColumn('admin_password_resets', 'status');
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },
};
