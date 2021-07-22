/**
 * Description: Users module service
 */

import moment, { Moment, unitOfTime } from 'moment';
import { Sequelize, Op } from 'sequelize';
import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { IConnector } from 'db/interfaces';
import { BaseService } from 'modules/common';
import { RequestQueries, GetEntityPayload, GetEntityResponse, GetListResponse } from 'modules/interfaces';
import { ApplicationError } from 'utils/response';
import { Crypto, Generator, autobind } from 'utils/helpers';
import { ERROR_CODES } from 'constants/error-codes';
import { TYPES } from 'DIContainer/types';

import { UserModel } from './user.model';
import { UserValidator } from './user.validator';
import { IUserRepository, IUserEntityService } from './interfaces';
import {
  CreateUserDTO,
  CreatedUserData,
  VerifyEmailPayload,
  LoginPayload,
  UserFavouritesPayload,
  UpdateUserDTO,
  SendNewOtpPayload,
  UserModelType,
  ChangePasswordDTO,
  ResetPasswordDTO,
  RestorePasswordDTO,
  UpdateSocialNetworkUserDTO,
  RegistrationOtpModelType,
  PasswordResetModelType,
  CreatedUserByAdminData,
} from './types';
import { USER_ERROR_MESSAGES } from '../user/constants';
import { IProductRepository, ProductModel, ProductModelType } from '../product';
import { IRegistrationOtpRepository } from '../registration-otp';
import { RegistrationOtpModel } from '../registration-otp/registration-otp.model';
import { PasswordResetModel } from '../password-reset/password-reset.model';

@injectable()
export class UserService extends BaseService implements IUserEntityService {
  protected readonly otpDuration: number;
  protected readonly otpDurationUnit: unitOfTime.DurationConstructor;

  constructor(
    @inject(TYPES.IConnector) protected readonly connector: IConnector,
    @inject(TYPES.IConfiguration) protected readonly configService: IConfiguration,
    @inject(TYPES.IUserRepository) protected readonly userRepository: IUserRepository,
    @inject(TYPES.IProductRepository) protected readonly productRepository: IProductRepository,
    @inject(TYPES.IRegistrationOtpRepository)
    protected readonly RegistrationOtpRepository: IRegistrationOtpRepository,
  ) {
    super();
    autobind(this);
    const OTP_MAX_AGE_AMOUNT = configService.get<string>('OTP_MAX_AGE_AMOUNT', '');
    const OTP_MAX_AGE_UNIT = configService.get<string>('OTP_MAX_AGE_UNIT');
    this.otpDuration = isNaN(parseInt(OTP_MAX_AGE_AMOUNT)) ? 4 : parseInt(OTP_MAX_AGE_AMOUNT);
    this.otpDurationUnit = (OTP_MAX_AGE_UNIT as unitOfTime.DurationConstructor) || 'minutes';
  }

  /**
   * Get a product as a common answer
   * on operations of creating / editing / getting by id
   */
  public async getEntityResponse({ id, include }: GetEntityPayload): Promise<GetEntityResponse<UserModel>> {
    const model = UserModel;
    const attributes = this.getModelAttributes<UserModelType>({ model });
    const result = await this.userRepository.getUser({
      where: { id, status: { [Op.gte]: 0 } },
      attributes,
      include,
    });

    return this.dryDataWithInclude({ model, data: result });
  }

  /**
   * Get list of users
   */
  public async getUsers(query: RequestQueries): Promise<GetListResponse<UserModel>> {
    const pagination = this.getPagination({ query });
    const order = this.getSort({ query });
    const attributes = this.getModelAttributes<UserModelType>({ model: UserModel });
    const { firstName = null, lastName = null, dobStartRange = null, dobEndRange = null } = query;

    return this.userRepository.getUsers({
      where: {
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
        ...this.getRangeFilter<string>('dob', dobStartRange, dobEndRange),
      },
      pagination,
      attributes,
      order: order.length ? order : undefined,
    });
  }

  /**
   * Get user by id
   */
  public async getUserById(userId: number, query?: RequestQueries): Promise<GetEntityResponse<UserModel>> {
    return this.getEntityResponse({ id: userId });
  }

  /**
   * Create user
   */
  public async createUser(payload: CreateUserDTO): Promise<CreatedUserData> {
    const allowedValues = await this._prepareUserToCreate(payload);
    const otp = Generator.generateOtp();

    const t = await this.connector.getConnection()?.transaction();
    if (!t) {
      this.throwTransactionError();
    }
    let user: UserModel;
    try {
      user = await this.userRepository.createUser(allowedValues, { transaction: t });
      await this.RegistrationOtpRepository.createOtpCode(
        {
          email: allowedValues.email,
          phoneNumber: user.phoneNumber,
          otp: otp,
          expireAt: moment().add(this.otpDuration, this.otpDurationUnit).toISOString(),
        },
        { transaction: t },
      );
      await t?.commit();
    } catch (error) {
      await t?.rollback();
      this.throwTransactionError();
    }

    return {
      id: user!.id,
      email: user!.email,
      firstName: allowedValues.firstName,
      lastName: allowedValues.lastName,
      otp,
    };
  }

  /**
   * Create user authenticated by social network
   */
  public async createSocialNetworkUser(payload: CreateUserDTO): Promise<CreatedUserData> {
    const driedValues = this.dryPayload<CreateUserDTO, Record<string, (arg: any) => any>>(
      payload,
      this.createUserPayloadSchema(),
    );

    UserValidator.createUserWithSocialNetworkValidator(driedValues);

    let user = await this.userRepository.getUser({ where: { email: driedValues.email } });

    if (!user) {
      const withHashedData = (data: CreateUserDTO) => ({
        ...data,
        password: null,
        referralCode: Generator.generateReferralCode(),
      });

      const options = {
        model: UserModel,
        modelSchemaKey: '_isCreatable',
        callback: withHashedData,
      };

      const allowedValues = this.useSchema(driedValues, options);

      user = await this.userRepository.createUser({ status: 1, ...allowedValues });
    } else {
      await this.userRepository.updateUser(
        {
          firstName: driedValues.firstName,
          lastName: driedValues.lastName,
          email: driedValues.email,
          socialId: driedValues.socialId,
          socialType: driedValues.socialType,
          profileImage: driedValues.profileImage,
        },
        {
          where: { id: user.id },
          returning: false,
        },
      );
      user = await this.userRepository.getUser({ where: { id: user.id } });
    }

    return {
      id: user!.id,
      email: user!.email,
      firstName: driedValues.firstName,
      lastName: driedValues.lastName,
    };
  }

  /**
   * Create user by admin-user
   */
  public async createUserByAdmin(payload: CreateUserDTO): Promise<CreatedUserByAdminData> {
    const allowedValues = await this._prepareUserToCreate(payload);
    const result = await this.userRepository.createUser({ ...allowedValues, status: 1 });
    return {
      id: result.id,
      email: result.email,
      temporaryPassword: payload.password,
      firstName: allowedValues.firstName,
      lastName: allowedValues.lastName,
    };
  }

  /**
   * Check registration otp code
   */
  public async checkOtpCode(values: VerifyEmailPayload): Promise<boolean> {
    const driedValues = this.dryPayload<VerifyEmailPayload, Record<string, (arg: any) => any>>(
      values,
      this.checkOtpCodePayloadSchema(),
    );

    UserValidator.checkOtpCodeValidator(driedValues);

    const attributes = this.getModelAttributes<RegistrationOtpModelType>({ model: RegistrationOtpModel });
    const { items } = await this.RegistrationOtpRepository.getOtpCodes({
      attributes,
      where: {
        email: values.email,
        expireAt: {
          [Op.gte]: Sequelize.fn('NOW'),
        },
        status: 0,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!items.length) {
      return false;
    }

    const registrationOtp = items[0].otp;

    if (registrationOtp !== values.otp) {
      return false;
    }

    const t = await this.connector.getConnection()?.transaction();
    if (!t) {
      this.throwTransactionError();
    }
    try {
      await this.RegistrationOtpRepository.updateOtpCode(
        { status: 1 },
        {
          where: { email: values.email },
          transaction: t,
        },
      );
      await this.userRepository.updateUser(
        {
          status: 1,
          emailVerifiedAt: moment().toISOString(),
        },
        {
          where: { email: values.email },
          transaction: t,
        },
      );
      await t?.commit();
    } catch (error) {
      await t?.rollback();
      this.throwTransactionError();
    }

    return true;
  }

  /**
   * Check user's login credentials
   */
  public async checkLoginCredentials(values: LoginPayload): Promise<UserModel | null> {
    const driedValues = this.dryPayload<LoginPayload, Record<string, (arg: any) => any>>(
      values,
      this._loginCredentialsPayloadSchema(),
    );
    UserValidator.loginValidator(driedValues);
    const user = await this.userRepository.getUser({ where: { email: driedValues.email } });
    return this._checkLoginCredentials<UserModel>(user, driedValues.password);
  }

  /**
   * Send new otp code to email
   */
  public async sendNewOtp(payload: SendNewOtpPayload): Promise<CreatedUserData | null> {
    const driedValues = this.dryPayload<SendNewOtpPayload, Record<string, (arg: any) => any>>(
      payload,
      this._sendNewOtpPayloadSchema(),
    );

    const user = await this.userRepository.getUser({ where: { email: driedValues.email } });

    if (user && user.status === 0) {
      const otp = Generator.generateOtp();

      await this.RegistrationOtpRepository.createOtpCode({
        email: user.email,
        phoneNumber: user.phoneNumber,
        otp: otp,
        expireAt: moment().add(this.otpDuration, this.otpDurationUnit).toISOString(),
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        otp,
      };
    }

    return null;
  }

  /**
   * Update user info by id
   */
  public async updateUser(id: number, payload: UpdateUserDTO): Promise<void> {
    const user = await this.userRepository.getUser({ where: { id } });

    if (!user) {
      this._throwNotFoundError();
    }

    if (user?.socialId) {
      return this.updateSocialNetworkUser(
        id,
        {
          phoneNumber: payload.phoneNumber,
          dob: payload.dob,
        },
        user,
      );
    }

    return this.updateNormalUser(id, payload, user!);
  }

  /**
   * Update `stripe_customer_token` field of user by user id
   */
  public async updateStripeCustomerToken(id: number, stripeCustomerToken: string): Promise<void> {
    UserValidator.updateStripeCustomerTokenValidator(stripeCustomerToken);

    const user = await this.userRepository.getUser({ where: { id } });

    if (!user) {
      this._throwNotFoundError();
    }

    await this.userRepository.updateUser({ stripeCustomerToken }, { where: { id } });
  }

  /**
   * Update `profile_image` field of user by user id
   */
  public async updateProfileImage(id: number, profileImageUrl: string): Promise<string> {
    UserValidator.updateProfileImageValidator(profileImageUrl);

    const user = await this.userRepository.getUser({ where: { id } });

    if (!user) {
      this._throwNotFoundError();
    }

    if (user?.socialId) {
      throw new ApplicationError({
        statusCode: 409,
        errorCode: ERROR_CODES.conflict,
        errorMessage: USER_ERROR_MESSAGES.CANT_UPDATE_PROFILE_IMAGE_WITH_SOCIAL(user.socialType),
        errors: [],
      });
    }

    await this.userRepository.updateUser({ profileImage: profileImageUrl }, { where: { id } });
    return user!.profileImage;
  }

  /**
   * Change user's password
   */
  public async changePassword(dto: ChangePasswordDTO): Promise<null> {
    const driedValues = this.dryPayload<ChangePasswordDTO>(dto, this._changeUserPasswordPayloadSchema());

    UserValidator.changePasswordValidator(driedValues);

    const user = await this.userRepository.getUser({
      attributes: ['email', 'password'],
      where: { id: dto.id },
    });

    if (!user) {
      this._throwNotFoundError();
    }

    if (!this._comparePasswords(dto.oldPassword, user!.password)) {
      throw new ApplicationError({
        statusCode: 400,
        errorCode: ERROR_CODES.validation,
        errorMessage: USER_ERROR_MESSAGES.INVALID_OLD_PASSWORD,
        errors: [],
      });
    }
    return this._setPassword({ email: user!.email, password: dto.newPassword });
  }

  /**
   * Generate restore password token
   */
  public async restorePassword(email: string): Promise<RestorePasswordDTO | null> {
    UserValidator.restorePasswordValidator(email);

    const user = await this.userRepository.getUser({ where: { email } });

    if (!user) {
      return null;
    }

    const token = Generator.generateChangePasswordToken();
    await this.userRepository.createPasswordReset({ email, token });

    return {
      firstName: user!.firstName,
      lastName: user!.lastName,
      email,
      token,
    };
  }

  /**
   * Reset user's password by special token
   */
  public async resetPassword(dto: ResetPasswordDTO): Promise<null> {
    const driedValues = this.dryPayload<ResetPasswordDTO>(dto, this._resetPasswordPayloadSchema());

    UserValidator.resetPasswordValidator(driedValues);

    const attributes = this.getModelAttributes<PasswordResetModelType>({ model: PasswordResetModel });
    const { items } = await this.userRepository.getPasswordResets({
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
      await this.userRepository.updateUser(
        { password: hash },
        {
          where: { email: passwordReset.email },
          transaction: t,
        },
      );
      await this.userRepository.updatePasswordReset(
        { status: 1 },
        {
          where: {
            email: passwordReset.email,
          },
          transaction: t,
        },
      );
      await t?.commit();
    } catch (error) {
      await t?.rollback();
      this.throwTransactionError();
    }

    return null;
  }

  /**
   * Add product to user's favourites by id
   */
  public async favouriteProducts(values: UserFavouritesPayload): Promise<void> {
    const driedValues = this.dryPayload<UserFavouritesPayload, Record<string, (arg: any) => any>>(
      values,
      this.favouriteProductsPayloadSchema(),
    );

    UserValidator.checkFavouritesPayloadValidator(driedValues);

    const user = await this.userRepository.getUser({ where: { id: driedValues.userId } });

    if (!user) {
      this._throwNotFoundError();
    }

    const product = await this.productRepository.getProduct({ where: { id: driedValues.productId } });

    if (!product) {
      throw new ApplicationError({
        statusCode: 404,
        errorMessage: USER_ERROR_MESSAGES.NOT_FOUND_PRODUCT,
        errorCode: ERROR_CODES.not_found,
        errors: [],
      });
    }

    switch (values.action) {
      case 'add':
        return user?.addUserFavouriteProducts([driedValues.productId]);
      case 'remove':
        return user?.removeUserFavouriteProducts([driedValues.productId]);
      default:
        throw new ApplicationError({
          statusCode: 400,
          errorCode: ERROR_CODES.validation,
          errorMessage: USER_ERROR_MESSAGES.INVALID_FAVOURITES_ACTION,
          errors: [],
        });
    }
  }

  /**
   * Get favourite products of user
   */
  public async getFavouriteProducts(
    userId: number,
    query: RequestQueries,
  ): Promise<GetListResponse<ProductModel>> {
    const pagination = this.getPagination({ query });
    const attributes = this.getModelAttributes<ProductModelType>({ model: ProductModel });

    const { items } = await this.productRepository.getDataFromFavourites({
      attributes: ['product_id'],
      where: { userId },
    });

    const productIds = items.map((item) => item['product_id']);
    return this.productRepository.getProducts({
      attributes,
      pagination,
      where: { id: { [Op.in]: productIds } },
    });
  }

  /**
   * Delete user by id (DEV)
   */
  public async deleteUser(id: number): Promise<number> {
    return this.userRepository.deleteUser({ where: { id } });
  }

  /**
   * Prepare data to be saved as user
   */
  private async _prepareUserToCreate(payload: CreateUserDTO) {
    const driedValues = this.dryPayload<CreateUserDTO, Record<string, (arg: any) => any>>(
      payload,
      this.createUserPayloadSchema(),
    );

    UserValidator.createUserWithEmailValidator(driedValues);

    const user = await this.userRepository.getUser({ where: { email: driedValues.email } });

    if (user) {
      this._throwExistedEntityError('email');
    }
    const normalizedPhoneNumber = this._parsePhoneNumber(driedValues.phoneNumber);
    const phoneNumber = await this.userRepository.getUser({
      where: { phoneNumber: normalizedPhoneNumber },
    });
    if (phoneNumber) {
      this._throwExistedEntityError('phone number');
    }

    const withHashedData = (data: CreateUserDTO) => ({
      ...data,
      password: Crypto.hashPassword(driedValues.password),
      referralCode: Generator.generateReferralCode(),
    });

    const options = {
      model: UserModel,
      modelSchemaKey: '_isCreatable',
      callback: withHashedData,
    };

    return {
      ...this.useSchema(driedValues, options),
      phoneNumber: normalizedPhoneNumber,
    };
  }

  /**
   * Format date into format `YYYY-MM-DD`
   */
  private _formatDate(date: string | Date | Moment): string {
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * Set a password for the user
   */
  protected async _setPassword(values: LoginPayload): Promise<null> {
    const driedValues = this.dryPayload<LoginPayload, Record<string, (arg: any) => any>>(
      values,
      this._loginCredentialsPayloadSchema(),
    );

    UserValidator.loginValidator(driedValues);

    const hash = Crypto.hashPassword(driedValues.password);

    await this.userRepository.updateUser({ password: hash }, { where: { email: driedValues.email } });

    return null;
  }

  /**
   * Update user info by id
   */
  protected async updateNormalUser(id: number, payload: UpdateUserDTO, user: UserModel): Promise<void> {
    const driedValues = this.dryPayload<UpdateUserDTO, Record<string, (arg: any) => any>>(
      payload,
      this.updateUserPayloadSchema(),
    );

    UserValidator.updateUserValidator(driedValues);

    const normalizedPhoneNumber = this._parsePhoneNumber(driedValues.phoneNumber);
    const phoneNumber = await this.userRepository.getUser({
      where: {
        phoneNumber: normalizedPhoneNumber,
        email: { [Op.ne]: user.email },
      },
    });
    if (phoneNumber) {
      this._throwExistedEntityError('phone number');
    }
    const dob = this._formatDate(payload.dob);

    await this.userRepository.updateUser(
      { ...driedValues, phoneNumber: normalizedPhoneNumber, dob },
      { where: { id }, returning: false },
    );
  }

  /**
   * Update social network user info by id
   */
  protected async updateSocialNetworkUser(
    id: number,
    payload: UpdateSocialNetworkUserDTO,
    user: UserModel,
  ): Promise<void> {
    const driedValues = this.dryPayload<UpdateSocialNetworkUserDTO>(
      payload,
      this.updateSocialNetworkUserPayloadSchema(),
    );

    UserValidator.updateSocialNetworkUserValidator(driedValues);

    const normalizedPhoneNumber = this._parsePhoneNumber(driedValues.phoneNumber);
    const phoneNumber = await this.userRepository.getUser({
      where: {
        phoneNumber: normalizedPhoneNumber,
        email: { [Op.ne]: user.email },
      },
    });
    if (phoneNumber) {
      this._throwExistedEntityError('phone number');
    }
    const dob = this._formatDate(payload.dob);

    await this.userRepository.updateUser(
      { phoneNumber: normalizedPhoneNumber, dob },
      { where: { id }, returning: false },
    );
  }

  /**
   * Throw error if user not found
   */
  private _throwNotFoundError(): void {
    throw new ApplicationError({
      statusCode: 404,
      errorMessage: USER_ERROR_MESSAGES.NOT_FOUND,
      errorCode: ERROR_CODES.not_found,
      errors: [],
    });
  }

  /**
   * Data transformation schema for user creation
   */
  private createUserPayloadSchema(): Record<string, (arg: string) => string | number> {
    return {
      firstName: (value: string): string => value,
      lastName: (value: string): string => value,
      // countryId: (value: string): number => parseInt(value),
      phoneNumber: (value: string): string => value,
      stripeCustomerToken: (value: string): string => value,
      email: (value: string): string => value,
      password: (value: string): string => value,
      socialId: (value: string): string => value,
      socialType: (value: string): string => value,
      profileImage: (value: string): string => value,
    };
  }

  /**
   * Data transformation schema for user editing
   */
  private updateUserPayloadSchema(): Record<string, (arg: any) => any> {
    return {
      firstName: (value: string): string => value,
      lastName: (value: string): string => value,
      dob: (value: string): string => value,
      phoneNumber: (value: string): string => value,
      stripeCustomerToken: (value: string): string => value,
      socialId: (value: string): string => value,
      profileImage: (value: string): string => value,
      status: (value: number): number => value,
      emailVerifiedAt: (value: string): string => value,
    };
  }

  /**
   * Data transformation schema for social network user editing
   */
  private updateSocialNetworkUserPayloadSchema(): Record<string, (arg: any) => any> {
    return {
      dob: (value: string): string => value,
      phoneNumber: (value: string): string => value,
    };
  }

  /**
   * Data transformation schema for email verification payload
   */
  private checkOtpCodePayloadSchema(): Record<string, (arg: string) => string | number> {
    return {
      email: (value: string) => value,
      otp: (value: string) => value,
    };
  }

  /**
   * Data transformation schema for add/remove favourite product
   */
  private favouriteProductsPayloadSchema(): Record<string, (arg: string) => string | number> {
    return {
      userId: (value: string) => parseInt(value),
      productId: (value: string) => value,
      action: (value: string) => value,
    };
  }

  /**
   * Data transformation schema for send new otp payload
   */
  private _sendNewOtpPayloadSchema(): Record<string, (arg: string) => string | number> {
    return {
      email: (value: string) => value,
    };
  }

  /**
   * Create error payload if user or phone number exists
   */
  private _throwExistedEntityError(condition: 'email' | 'phone number'): Array<string> {
    throw new ApplicationError({
      statusCode: 400,
      errorCode: ERROR_CODES.conflict,
      errorMessage: `User with the same ${condition} already exists`,
      errors: [],
    });
  }
}
