/**
 * Description: Admins table seed
 */

import { QueryInterface } from 'sequelize';

const crypto = require('crypto');
// const
const { CRYPTO_SECRET } = process.env;
const key = crypto.scryptSync(CRYPTO_SECRET, 'salt', 24);

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('admins', [
      {
        name: 'Admin',
        email: 'admin-user@easyguide.com',
        password: crypto.pbkdf2Sync('xB\\?g(,m7k<s-J6/', key, 2048, 32, 'sha512').toString('hex'),
        is_activated: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('admins', {
      email: 'admin-user@easyguide.com',
    });
  },
};
