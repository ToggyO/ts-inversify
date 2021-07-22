/**
 * Description: Admin - Auth module interfaces
 */

import { NextFunction, Request, Response } from 'express';
import { CreateOptions, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';

import { GetEntityPayload, GetEntityResponse, GetListResponse, GetParameters } from 'modules/interfaces';
import {
  ChangePasswordDTO,
  CreatePasswordResetDTO,
  LoginPayload,
  ResetPasswordDTO,
  UpdatePasswordResetDTO,
} from 'modules/v1/user';

import { AdminModel } from './models/admin.model';
import { AdminPasswordResetModel } from './models/admin-password-reset.model';
import { CreateAdminDTO, RestorePasswordAdminDTO, UpdateAdminDTO } from './admin-user.admin.types';

export interface IAuthAdminHandler {
  getAdminById(req: Request, res: Response, next: NextFunction): Promise<void>;
  checkLoginCredentials(req: Request, res: Response, next: NextFunction): Promise<void>;
  restorePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateAdmin(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProfileImage(req: Request, res: Response, next: NextFunction): Promise<void>;
  changePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IAuthAdminService {
  getEntityResponse({ id, include }: GetEntityPayload): Promise<GetEntityResponse<AdminModel>>;
  checkLoginCredentials(values: LoginPayload): Promise<AdminModel | null>;
  restorePassword(email: string): Promise<RestorePasswordAdminDTO | null>;
  resetPassword(dto: ResetPasswordDTO): Promise<null>;
  updateAdmin(id: number, dto: UpdateAdminDTO): Promise<void>;
  updateProfileImage(id: number, profileImageUrl: string): Promise<string>;
  changePassword(dto: ChangePasswordDTO): Promise<null>;
}

export interface IAuthAdminRepository {
  getAdmins(payload: GetParameters): Promise<GetListResponse<AdminModel>>;
  getAdmin(payload: FindOptions): Promise<AdminModel | null>;
  createAdmin(payload: CreateAdminDTO, options?: CreateOptions<AdminModel>): Promise<AdminModel>;
  updateAdmin(
    payload: Partial<CreateAdminDTO>,
    options: UpdateOptions<AdminModel>,
  ): Promise<[number, AdminModel[]]>;
  deleteAdmin(options: DestroyOptions<AdminModel>): Promise<number>;
  getPasswordResets(payload: GetParameters): Promise<GetListResponse<AdminPasswordResetModel>>;
  createPasswordReset(
    payload: CreatePasswordResetDTO,
    options?: CreateOptions<AdminPasswordResetModel>,
  ): Promise<AdminPasswordResetModel>;
  updatePasswordReset(
    payload: Partial<UpdatePasswordResetDTO>,
    options: UpdateOptions<AdminPasswordResetModel>,
  ): Promise<[number, AdminPasswordResetModel[]]>;
}
