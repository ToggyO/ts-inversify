/**
 * Description: Admins table seed
 */

import { QueryInterface } from 'sequelize';

const crypto = require('crypto');

const { CRYPTO_SECRET } = process.env;
const key = crypto.scryptSync(CRYPTO_SECRET, 'salt', 24);
const passwordHash = crypto.pbkdf2Sync('xB\\?g(,m7k<s-J6/', key, 2048, 32, 'sha512').toString('hex');

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('admins', [
      {
        name: 'Admin',
        email: 'admin@easyguide.com',
        password: passwordHash,
        is_activated: 1,
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('admins', {
      email: 'admin@easyguide.com',
    });
  },
};
