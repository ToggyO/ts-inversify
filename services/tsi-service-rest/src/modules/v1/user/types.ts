/**
 * Description: Types and interfaces for user module
 */

import { NextFunction, Request, Response } from 'express';

import { BlockStatuses } from 'constants/block-statuses';

export interface IUserHandler {
  getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  favouriteProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
  socialId: string;
  socialType: string;
  emailVerifiedAt: Date;
  phoneVerifiedAt: Date;
  // sentEmail: Date;
  reminderEmail: number;
  password: string;
  countryId?: number;
  phoneNumber: string;
  isMobileRegistered: number;
  dob: Date;
  age: number;
  gender: Gender;
  profileImage: string;
  status: number;
  deviceType: string;
  rememberToken: string;
  stripeCustomerToken: string;
  // utmSource: string;
  // utmMedium: string;
  langCode: string;
  isBlocked: BlockStatuses;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserDTO = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
};

export type CreatedUserResponse = {
  user: User;
  otp: string;
};

export type CreatedUserByAdminData = {
  id: number;
  email: string;
  temporaryPassword: string;
  firstName: string;
  lastName: string;
};

export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
};
