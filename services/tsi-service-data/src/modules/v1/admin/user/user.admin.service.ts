/**
 * Description: Admin - Users module service
 */

import { Includeable, Op } from 'sequelize';
import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseService } from 'modules/common';
import { autobind } from 'utils/helpers';
import { RequestQueries } from 'modules/interfaces';
import { ApplicationError } from 'utils/response';
import { ERROR_CODES } from 'constants/error-codes';
import { USER_ERROR_MESSAGES } from 'modules/v1/user/constants';
import { ChangeEmailDTO, IUserRepository, UserModel } from 'modules/v1/user';

import { IUserAdminService } from './user.admin.interfaces';
import { UserValidator } from 'modules/v1/user/user.validator';

@injectable()
export class UserAdminService extends BaseService implements IUserAdminService {
  constructor(@inject(TYPES.IUserRepository) private readonly _repository: IUserRepository) {
    super();
    autobind(this);
  }

  /**
   * Change user's email
   */
  public async changeEmail(userId: number, newEmail: string): Promise<ChangeEmailDTO> {
    UserValidator.changeEmailValidator(newEmail);
    const user = await this._checkUserExistence(userId);
    if (user.email === newEmail) {
      throw new ApplicationError({
        statusCode: 409,
        errorCode: ERROR_CODES.conflict,
        errorMessage: USER_ERROR_MESSAGES.CHANGE_EMAIL_ERROR,
        errors: [],
      });
    }

    const isEmailNotUnique = await this._repository.getUser({
      where: {
        id: { [Op.ne]: userId },
        email: newEmail,
      },
    });
    if (isEmailNotUnique) {
      throw new ApplicationError({
        statusCode: 404,
        errorCode: ERROR_CODES.not_found,
        errorMessage: USER_ERROR_MESSAGES.NOT_UNIQUE('email'),
        errors: [],
      });
    }

    await this._repository.updateUser({ email: newEmail, status: 0 }, { where: { id: userId } });
    return {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      oldEmail: user!.email,
      newEmail,
    };
  }

  /**
   * Block/Unblock user
   */
  public async toggleBlockUser(userId: number, query: RequestQueries): Promise<Array<Includeable>> {
    const user = await this._checkUserExistence(userId);
    const isBlocked = user.isBlocked === 1 ? 0 : 1;
    await this._repository.updateUser({ isBlocked }, { where: { id: userId } });
    return this.getInclude({ query });
  }

  /**
   * Get user by id or throw `not found exception`
   */
  private async _checkUserExistence(userId: number, include?: Array<Includeable>): Promise<UserModel> {
    const user = await this._repository.getUser({
      where: { id: userId },
      ...(include ? { include } : {}),
    });
    if (!user) {
      throw new ApplicationError({
        statusCode: 404,
        errorCode: ERROR_CODES.not_found,
        errorMessage: USER_ERROR_MESSAGES.NOT_FOUND,
        errors: [],
      });
    }
    return user;
  }
}
