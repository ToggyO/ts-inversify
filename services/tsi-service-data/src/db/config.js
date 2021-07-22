/* eslint-disable no-undef */
/**
 * Description: Sequelize-cli config for migrations and seeds
 */
require('reflect-metadata');
const { ConfigurationService } = require('../config/index');
// print environment variables
new ConfigurationService();

// Migrations can be done only after built project into js
const {
  TSI_MYSQL_USER,
  TSI_MYSQL_PASSWORD,
  TSI_MYSQL_DATABASE,
  TSI_MYSQL_HOST,
  TSI_MYSQL_PORT,
  TSI_MYSQL_EXTERNAL_PORT,
} = process.env;

module.exports = {
  development: {
    username: TSI_MYSQL_USER,
    password: TSI_MYSQL_PASSWORD,
    database: TSI_MYSQL_DATABASE,
    host: TSI_MYSQL_HOST,
    port: TSI_MYSQL_EXTERNAL_PORT,
    dialect: 'mysql',
  },
  staging: {
    username: TSI_MYSQL_USER,
    password: TSI_MYSQL_PASSWORD,
    database: TSI_MYSQL_DATABASE,
    host: TSI_MYSQL_HOST,
    port: TSI_MYSQL_PORT,
    dialect: 'mysql',
  },
  production: {
    username: TSI_MYSQL_USER,
    password: TSI_MYSQL_PASSWORD,
    database: TSI_MYSQL_DATABASE,
    host: TSI_MYSQL_HOST,
    port: TSI_MYSQL_PORT,
    dialect: 'mysql',
  },
};
