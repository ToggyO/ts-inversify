/**
 * Description: Admin - Auth module repository
 */

import { CreateOptions, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IDbContext } from 'db/interfaces';
import { BaseRepository } from 'modules/common';
import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, GetParameters } from 'modules/interfaces';

import { IAuthAdminRepository } from './admin-user.admin.interfaces';
import { CreateAdminDTO } from './admin-user.admin.types';
import { AdminModel } from './models/admin.model';
import { CreatePasswordResetDTO, UpdatePasswordResetDTO } from 'modules/v1/user';
import { AdminPasswordResetModel } from './models/admin-password-reset.model';

@injectable()
export class AdminUserAdminRepository extends BaseRepository implements IAuthAdminRepository {
  constructor(@inject(TYPES.DbContext) protected readonly dbContext: IDbContext) {
    super();
    autobind(this);
  }

  /**
   * Get list of admins
   */
  public async getAdmins({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<AdminModel>> {
    const admins = await this.dbContext.AdminModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<AdminModel>>(admins, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: admins.count }, pagination),
    };
  }

  /**
   * Get admin-user
   */
  public async getAdmin({ where = {}, attributes, include }: FindOptions): Promise<AdminModel | null> {
    return this.dbContext.AdminModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Create admin-user
   */
  public async createAdmin(
    payload: CreateAdminDTO,
    options?: CreateOptions<AdminModel>,
  ): Promise<AdminModel> {
    return this.dbContext.AdminModel.create(payload, options);
  }

  /**
   * Update Admin
   */
  public async updateAdmin(
    payload: Partial<CreateAdminDTO>,
    options: UpdateOptions<AdminModel>,
  ): Promise<[number, AdminModel[]]> {
    return this.dbContext.AdminModel.update(payload, options);
  }

  /**
   * Delete admin-user by id
   */
  public async deleteAdmin(options: DestroyOptions<AdminModel>): Promise<number> {
    return this.dbContext.AdminModel.destroy(options);
  }

  /**
   * Get list of admin-user password reset records
   */
  public async getPasswordResets({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<AdminPasswordResetModel>> {
    const resets = await this.dbContext.AdminPasswordResetModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<AdminPasswordResetModel>>(resets, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: resets.count }, pagination),
    };
  }

  /**
   * Create admin-user password reset record
   */
  public async createPasswordReset(
    payload: CreatePasswordResetDTO,
    options?: CreateOptions<AdminPasswordResetModel>,
  ): Promise<AdminPasswordResetModel> {
    return this.dbContext.AdminPasswordResetModel.create(payload, options);
  }

  /**
   * Update admin-user password reset record
   */
  public async updatePasswordReset(
    payload: Partial<UpdatePasswordResetDTO>,
    options: UpdateOptions<AdminPasswordResetModel>,
  ): Promise<[number, AdminPasswordResetModel[]]> {
    return this.dbContext.AdminPasswordResetModel.update(payload, options);
  }
}
