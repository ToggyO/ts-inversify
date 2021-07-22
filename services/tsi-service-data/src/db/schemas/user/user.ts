/**
 * Description: Sequelize schema for users table
 */

import { DataTypes, Sequelize } from 'sequelize';

// Do not make shortened import
import { CustomModelAttributes, SequelizeDataTypes } from 'db/interfaces';
import { SOCIAL_TYPES } from '../../../constants/social-types';
import { Gender } from '../../../constants/genders';

/**
 * Sequelize schema export
 */
const schema = (sequelize: Sequelize, DataTypes: SequelizeDataTypes): CustomModelAttributes => ({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    field: 'first_name',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  lastName: {
    field: 'last_name',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    _isEditable: true,
    _isCreatable: true,
  },
  referralCode: {
    field: 'referral_code',
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    _isEditable: true,
    _isCreatable: true,
  },
  socialId: {
    field: 'social_id',
    type: DataTypes.ENUM([SOCIAL_TYPES.GOOGLE, SOCIAL_TYPES.FACEBOOK]),
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  socialType: {
    field: 'social_type',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  emailVerifiedAt: {
    field: 'email_verified_at',
    type: DataTypes.DATE,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  phoneVerifiedAt: {
    field: 'phone_verified_at',
    type: DataTypes.DATE,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  // sentEmail: {
  //   field: 'sent_email',
  //   type: DataTypes.DATE,
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   defaultValue: sequelize.fn('NOW'),
  // },
  reminderEmail: {
    field: 'reminder_email',
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  countryId: {
    field: 'country_id',
    type: DataTypes.INTEGER,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  phoneNumber: {
    field: 'phone_number',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  isMobileRegistered: {
    field: 'is_mobile_registered',
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
    _isHidden: true,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  gender: {
    type: DataTypes.ENUM([Gender.Male, Gender.Female, Gender.Other]),
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  profileImage: {
    field: 'profile_image',
    type: DataTypes.STRING,
    allowNull: true,
    _isEditable: true,
    _isCreatable: true,
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    _isEditable: true,
    _isCreatable: true,
  },
  deviceType: {
    field: 'device_type',
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
    _isEditable: true,
    _isCreatable: true,
  },
  rememberToken: {
    field: 'remember_token',
    type: DataTypes.STRING,
    allowNull: true,
    _isHidden: true,
    _isEditable: true,
    _isCreatable: true,
  },
  stripeCustomerToken: {
    field: 'stripe_customer_token',
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    _isEditable: true,
    _isCreatable: true,
  },
  // utmSource: {
  //   field: 'utm_source',
  //   type: DataTypes.STRING,
  //   allowNull: true,
  //   _isEditable: true,
  //   _isCreatable: true,
  // },
  // utmMedium: {
  //   field: 'utm_medium',
  //   type: DataTypes.STRING,
  //   allowNull: true,
  //   _isEditable: true,
  //   _isCreatable: true,
  // },
  langCode: {
    field: 'lang_code',
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'en_GB',
    _isCreatable: true,
    _isEditable: true,
  },
  isBlocked: {
    field: 'is_blocked',
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    _isCreatable: true,
    _isEditable: true,
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
  updatedAt: {
    field: 'updated_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
});

module.exports = schema;
