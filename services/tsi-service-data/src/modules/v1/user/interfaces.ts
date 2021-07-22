/**
 * Description: Interfaces for user entity
 */

import { NextFunction, Request, Response } from 'express';
import {
  GetEntityPayload,
  GetEntityResponse,
  GetListResponse,
  GetParameters,
  IBaseService,
  RequestQueries,
} from 'modules/interfaces';
import { UserModel } from 'modules/v1/user/user.model';
import { CreateOptions, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';
import { PasswordResetModel } from 'modules/v1/password-reset/password-reset.model';
import {
  ChangeEmailDTO,
  ChangePasswordDTO,
  CreatedUserByAdminData,
  CreatedUserData,
  CreatePasswordResetDTO,
  CreateUserDTO,
  LoginPayload,
  ResetPasswordDTO,
  RestorePasswordDTO,
  SendNewOtpPayload,
  UpdatePasswordResetDTO,
  UpdateUserDTO,
  UserFavouritesPayload,
  VerifyEmailPayload,
} from 'modules/v1/user/types';
import { ProductModel } from 'modules/v1/product';

export interface IUserHandler {
  getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserById(req: Request, res: Response, next: NextFunction): Promise<void>;
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  checkOtpCode(req: Request, res: Response, next: NextFunction): Promise<void>;
  checkLoginCredentials(req: Request, res: Response, next: NextFunction): Promise<void>;
  sendNewOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateStripeCustomerToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProfileImage(req: Request, res: Response, next: NextFunction): Promise<void>;
  changePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  restorePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  favouriteProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
  getFavouriteProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteUser?(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IUserEntityService extends IBaseService {
  getEntityResponse(payload: GetEntityPayload): Promise<GetEntityResponse<UserModel>>;
  getUsers(query: RequestQueries): Promise<GetListResponse<UserModel>>;
  getUserById(userId: number, query?: RequestQueries): Promise<GetEntityResponse<UserModel>>;
  createUser(payload: CreateUserDTO): Promise<CreatedUserData>;
  createSocialNetworkUser(payload: CreateUserDTO): Promise<CreatedUserData>;
  createUserByAdmin(payload: CreateUserDTO): Promise<CreatedUserByAdminData>;
  checkOtpCode(values: VerifyEmailPayload): Promise<boolean>;
  checkLoginCredentials(values: LoginPayload): Promise<UserModel | null>;
  sendNewOtp(payload: SendNewOtpPayload): Promise<CreatedUserData | null>;
  updateUser(id: number, payload: UpdateUserDTO): Promise<void>;
  updateStripeCustomerToken(id: number, stripeCustomerToken: string): Promise<void>;
  updateProfileImage(id: number, profileImageUrl: string): Promise<string>;
  changePassword(dto: ChangePasswordDTO): Promise<null>;
  restorePassword(email: string): Promise<RestorePasswordDTO | null>;
  resetPassword(dto: ResetPasswordDTO): Promise<null>;
  favouriteProducts(values: UserFavouritesPayload): Promise<void>;
  getFavouriteProducts(userId: number, query: RequestQueries): Promise<GetListResponse<ProductModel>>;
  deleteUser(id: number): Promise<number>;
}

export interface IUserRepository {
  getUsers(payload: GetParameters): Promise<GetListResponse<UserModel>>;
  getUser(payload: FindOptions): Promise<UserModel | null>;
  createUser(payload: CreateUserDTO, options?: CreateOptions<UserModel>): Promise<UserModel>;
  updateUser(payload: Partial<UpdateUserDTO>, options: UpdateOptions): Promise<[number, UserModel[]]>;
  deleteUser(options: DestroyOptions<UserModel>): Promise<number>;
  getPasswordResets(payload: GetParameters): Promise<GetListResponse<PasswordResetModel>>;
  createPasswordReset(
    payload: CreatePasswordResetDTO,
    options?: CreateOptions<PasswordResetModel>,
  ): Promise<PasswordResetModel>;
  updatePasswordReset(
    payload: Partial<UpdatePasswordResetDTO>,
    options: UpdateOptions<PasswordResetModel>,
  ): Promise<[number, PasswordResetModel[]]>;
}
