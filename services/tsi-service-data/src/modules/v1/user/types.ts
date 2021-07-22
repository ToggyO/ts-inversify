/**
 * Description: Types for user entity
 */

import { Gender } from 'constants/genders';
import { SOCIAL_TYPES } from 'constants/social-types';
import { DryDataWithInclude } from 'modules/interfaces';

import { UserModel } from './user.model';
import { PasswordResetModel } from '../password-reset/password-reset.model';
import { RegistrationOtpModel } from '../registration-otp/registration-otp.model';

export type UserModelType = typeof UserModel;

export type RegistrationOtpModelType = typeof RegistrationOtpModel;

export type PasswordResetModelType = typeof PasswordResetModel;

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
  socialId: string;
  socialType: typeof SOCIAL_TYPES;
  emailVerifiedAt: Date;
  phoneVerifiedAt: Date;
  // sentEmail: Date;
  reminderEmail: number;
  password: string;
  countryId: number;
  phoneNumber: string;
  isMobileRegistered: number;
  dob: Date;
  age: number;
  gender: typeof Gender;
  profileImage: string;
  status: number;
  deviceType: string;
  rememberToken: string;
  stripeCustomerToken: string;
  // utmSource: string;
  // utmMedium: string;
  langCode: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserDTO = {
  firstName: string;
  lastName: string;
  countryId: string;
  phoneNumber: string;
  email: string;
  password: string;
  stripeCustomerToken: string;
  socialId?: string;
  socialType?: typeof SOCIAL_TYPES;
  profileImage?: string;
  status?: number;
};

export type CreteUserBasePayload = {
  firstName: string;
  lastName: string;
  // countryId: string;
  email: string;
  stripeCustomerToken: string;
};

export type CreatedUserData = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  otp?: string;
};

export type CreatedUserByAdminData = {
  id: number;
  email: string;
  temporaryPassword: string;
  firstName: string;
  lastName: string;
};

export type CreatedUserResponse = { user: DryDataWithInclude<UserModel>; otp?: string };

export type VerifyEmailPayload = { id?: number; email: string; otp: string };

export type LoginPayload = { email: string; password: string };

export type SendNewOtpPayload = { email: string };

export type UserFavouritesPayload = {
  userId: number;
  productId: number;
  action: 'add' | 'remove';
};

export type UpdateUserDTO = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dob: string;
  socialId: string;
  socialType: typeof SOCIAL_TYPES;
  stripeCustomerToken: string;
  profileImage: string;
  status: number;
  isBlocked: 0 | 1;
  emailVerifiedAt?: string;
};

export type UpdateSocialNetworkUserDTO = {
  phoneNumber: string;
  dob: string;
};

export type ChangeEmailPayload = {
  id: number;
  email: string;
};

export type ChangeEmailDTO = {
  id: number;
  firstName: string;
  lastName: string;
  oldEmail: string;
  newEmail: string;
};

export type ChangePasswordDTO = {
  id: number;
  oldPassword: string;
  newPassword: string;
};

export type RestorePasswordDTO = {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
};

export type CreatePasswordResetDTO = {
  email: string;
  token: string;
};

export type UpdatePasswordResetDTO = {
  status: number;
  email: string;
  token: string;
};

export type ResetPasswordDTO = {
  token: string;
  password: string;
};

export type CustomersIds = {
  userId?: number;
  guestId?: number;
};
