/**
 * Description: Users module repository
 */

import { CreateOptions, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IDbContext } from 'db/interfaces';
import { BaseRepository } from 'modules/common';
import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, GetParameters } from 'modules/interfaces';

import { UserModel } from './user.model';
import { IUserRepository } from './interfaces';
import { CreatePasswordResetDTO, CreateUserDTO, UpdatePasswordResetDTO, UpdateUserDTO } from './types';
import { PasswordResetModel } from '../password-reset/password-reset.model';

@injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
  constructor(@inject(TYPES.DbContext) protected readonly dbContext: IDbContext) {
    super();
    autobind(this);
  }

  /**
   * Get list of users
   */
  public async getUsers({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<UserModel>> {
    const user = await this.dbContext.UserModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<UserModel>>(user, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: user.count }, pagination),
    };
  }

  /**
   * Get user
   */
  public async getUser({ where = {}, attributes, include }: FindOptions): Promise<UserModel | null> {
    return this.dbContext.UserModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Create user
   */
  public async createUser(payload: CreateUserDTO, options?: CreateOptions<UserModel>): Promise<UserModel> {
    return this.dbContext.UserModel.create(payload, options);
  }

  /**
   * Update user
   */
  public async updateUser(
    payload: Partial<UpdateUserDTO>,
    options: UpdateOptions<UserModel>,
  ): Promise<[number, UserModel[]]> {
    return this.dbContext.UserModel.update(payload, options);
  }

  /**
   * Delete user by id (DEV)
   */
  public async deleteUser(options: DestroyOptions<UserModel>): Promise<number> {
    return this.dbContext.UserModel.destroy(options);
  }

  /**
   * Get list of password reset records
   */
  public async getPasswordResets({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<PasswordResetModel>> {
    const resets = await this.dbContext.PasswordResetModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<PasswordResetModel>>(resets, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: resets.count }, pagination),
    };
  }

  /**
   * Create password reset record
   */
  public async createPasswordReset(
    payload: CreatePasswordResetDTO,
    options?: CreateOptions<PasswordResetModel>,
  ): Promise<PasswordResetModel> {
    return this.dbContext.PasswordResetModel.create(payload, options);
  }

  /**
   * Update password reset record
   */
  public async updatePasswordReset(
    payload: Partial<UpdatePasswordResetDTO>,
    options: UpdateOptions<PasswordResetModel>,
  ): Promise<[number, PasswordResetModel[]]> {
    return this.dbContext.PasswordResetModel.update(payload, options);
  }
}
