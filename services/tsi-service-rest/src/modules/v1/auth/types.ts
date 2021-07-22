/**
 * Description: Types and interfaces for auth module
 */

import { NextFunction, Request, Response } from 'express';

import { ExtendedRequest } from 'declaration';

import { User } from '../user';

export interface IAuthHandler {
  loginWithEmail(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  loginWithGoogle(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  loginWithFacebook(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  registration(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyEmailWithAuth(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  sendNewOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  restorePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export type LoginPayload = { email: string; password: string };

export type AuthDTO<T> = { user: T };

export type GoogleAccessPayload = { idToken: string };

export type FacebookAccessPayload = { accessToken: string };

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type VerifyEmailWithAuthPayload = {
  email: string;
  otp: string;
};

export type SendNewOtpPayload = { email: string };

export type SendNewOtpResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  otp: string;
};

export type RestorePasswordDTO = {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
};

export type ResetPasswordDTO = {
  token: string;
  password: string;
};

export type CustomerDTO = {
  stripeCustomerToken: string;
};
