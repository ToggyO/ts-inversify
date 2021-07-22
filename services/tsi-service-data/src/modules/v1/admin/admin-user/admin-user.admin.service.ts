/**
 * Description: Admin - Auth module service
 */

import { Includeable, Op } from 'sequelize';
import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseService } from 'modules/common';
import { IConnector } from 'db/interfaces';
import { autobind, Crypto, Generator } from 'utils/helpers';
import { GetEntityPayload, GetEntityResponse } from 'modules/interfaces';
import { ApplicationError } from 'utils/response';
import { ERROR_CODES } from 'constants/error-codes';
import { ChangePasswordDTO, LoginPayload, ResetPasswordDTO } from 'modules/v1/user';
import { UserValidator } from 'modules/v1/user/user.validator';
import { USER_ERROR_MESSAGES } from 'modules/v1/user/constants';

import { IAuthAdminRepository, IAuthAdminService } from './admin-user.admin.interfaces';
import { AdminModel } from './models/admin.model';
import { AdminPasswordResetModel } from './models/admin-password-reset.model';
import { AdminUserAdminValidator } from './admin-user.admin.validator';
import { RestorePasswordAdminDTO, UpdateAdminDTO } from './admin-user.admin.types';

@injectable()
export class AdminUserAdminService extends BaseService implements IAuthAdminService {
  constructor(
    @inject(TYPES.IConnector) protected readonly connector: IConnector,
    @inject(TYPES.IAuthAdminRepository) private readonly _repository: IAuthAdminRepository,
  ) {
    super();
    autobind(this);
  }

  /**
   * Get a product as a common answer
   * on operations of creating / editing / getting by id
   */
  public async getEntityResponse({ id, include }: GetEntityPayload): Promise<GetEntityResponse<AdminModel>> {
    const model = AdminModel;
    const attributes = this.getModelAttributes<typeof AdminModel>({ model });
    const result = await this._repository.getAdmin({
      where: { id },
      attributes,
      include,
    });
    return this.dryDataWithInclude({ model, data: result });
  }

  /**
   * Check admin login credentials
   */
  public async checkLoginCredentials(values: LoginPayload): Promise<AdminModel | null> {
    const driedValues = this.dryPayload<LoginPayload, Record<string, (arg: any) => any>>(
      values,
      this._loginCredentialsPayloadSchema(),
    );
    AdminUserAdminValidator.loginValidator(driedValues);
    const admin = await this._repository.getAdmin({ where: { email: driedValues.email } });
    return this._checkLoginCredentials<AdminModel>(admin, driedValues.password);
  }

  /**
   * Generate restore password token
   */
  public async restorePassword(email: string): Promise<RestorePasswordAdminDTO | null> {
    UserValidator.restorePasswordValidator(email);
    const admin = await this._repository.getAdmin({ where: { email } });
    if (!admin) {
      return null;
    }
    const token = Generator.generateChangePasswordToken();
    await this._repository.createPasswordReset({ email, token });
    return {
      name: admin.name,
      email,
      token,
    };
  }

  /**
   * Reset admin password by special token
   */
  public async resetPassword(dto: ResetPasswordDTO): Promise<null> {
    const driedValues = this.dryPayload<ResetPasswordDTO>(dto, this._resetPasswordPayloadSchema());
    UserValidator.resetPasswordValidator(driedValues);
    const attributes = this.getModelAttributes<typeof AdminPasswordResetModel>({
      model: AdminPasswordResetModel,
    });
    const { items } = await this._repository.getPasswordResets({
      attributes,
      where: {
        token: driedValues.token,
        status: {
          [Op.lt]: 1,
        },
      },
    });

    if (!items.length) {
      throw new ApplicationError({
        statusCode: 400,
        errorCode: ERROR_CODES.validation,
        errorMessage: USER_ERROR_MESSAGES.INVALID_RESTORE_PASSWORD_TOKEN,
        errors: [],
      });
    }

    const passwordReset = items[0];
    const hash = Crypto.hashPassword(dto.password);
    const t = await this.connector.getConnection()?.transaction();
    if (!t) {
      this.throwTransactionError();
    }
    try {
      await this._repository.updateAdmin(
        { password: hash },
        {
          where: { email: passwordReset.email },
          transaction: t,
        },
      );
      await this._repository.updatePasswordReset(
        { status: 1 },
        {
          where: {
            email: passwordReset.email,
          },
          transaction: t,
        },
      );
      await t?.commit();
    } catch (e) {
      await t?.rollback();
      this.throwTransactionError();
    }
    return null;
  }

  /**
   * Update admin
   */
  public async updateAdmin(id: number, dto: UpdateAdminDTO): Promise<void> {
    await this._checkAdminExistence(id);

    const driedValues = this.dryPayload<UpdateAdminDTO>(dto, this._updateAdminPayloadSchema());
    AdminUserAdminValidator.updateValidator(dto);

    const isEmailNotUnique = await this._repository.getAdmin({
      where: {
        id: { [Op.ne]: id },
        email: driedValues.email,
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
    const phoneNumber = this._parsePhoneNumber(driedValues.phoneNumber);
    await this._repository.updateAdmin({ ...driedValues, phoneNumber }, { where: { id } });
  }

  /**
   * Change admin password
   */
  public async changePassword(dto: ChangePasswordDTO): Promise<null> {
    const admin = await this._checkAdminExistence(dto.id);
    const driedValues = this.dryPayload<ChangePasswordDTO>(dto, this._changeUserPasswordPayloadSchema());
    UserValidator.changePasswordValidator(driedValues);

    if (!this._comparePasswords(dto.oldPassword, admin!.password)) {
      throw new ApplicationError({
        statusCode: 400,
        errorCode: ERROR_CODES.validation,
        errorMessage: USER_ERROR_MESSAGES.INVALID_OLD_PASSWORD,
        errors: [],
      });
    }
    const hash = Crypto.hashPassword(driedValues.newPassword);
    await this._repository.updateAdmin({ password: hash }, { where: { id: dto.id } });
    return null;
  }

  /**
   * Update `profile_image` field of admin by id
   */
  public async updateProfileImage(id: number, profileImageUrl: string): Promise<string> {
    UserValidator.updateProfileImageValidator(profileImageUrl);
    const admin = await this._repository.getAdmin({ where: { id } });
    if (!admin) {
      throw new ApplicationError({
        statusCode: 404,
        errorMessage: USER_ERROR_MESSAGES.NOT_FOUND,
        errorCode: ERROR_CODES.not_found,
        errors: [],
      });
    }
    await this._repository.updateAdmin({ profileImage: profileImageUrl }, { where: { id } });
    return admin.profileImage;
  }

  /**
   * Get admin by id or throw `not found exception`
   */
  private async _checkAdminExistence(id: number, include?: Array<Includeable>): Promise<AdminModel> {
    const admin = await this._repository.getAdmin({
      where: { id },
      ...(include ? { include } : {}),
    });
    if (!admin) {
      throw new ApplicationError({
        statusCode: 404,
        errorCode: ERROR_CODES.not_found,
        errorMessage: USER_ERROR_MESSAGES.NOT_FOUND,
        errors: [],
      });
    }
    return admin;
  }

  /**
   * Data transformation schema for admin editing
   */
  private _updateAdminPayloadSchema(): Record<string, (arg: any) => any> {
    return {
      name: (value: string): string => value,
      email: (value: string): string => value,
      address: (value: string): string => value,
      postalCode: (value: string): string => value,
      phoneNumber: (value: string): string => value,
      landline: (value: string): string => value,
    };
  }
}
