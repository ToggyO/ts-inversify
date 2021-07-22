/**
 * Description: Users module repository
 */

import { CreateOptions, UpdateOptions } from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IDbContext } from 'db/interfaces';
import { BaseRepository } from 'modules/common';
import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, GetParameters } from 'modules/interfaces';

import { RegistrationOtpModel } from './registration-otp.model';
import { CreateOtpCodeDTO, IRegistrationOtpRepository, UpdateOtpCode } from './types';

@injectable()
export class RegistrationOtpRepository extends BaseRepository implements IRegistrationOtpRepository {
  constructor(@inject(TYPES.DbContext) protected readonly dbContext: IDbContext) {
    super();
    autobind(this);
  }

  /**
   * Get list of users
   */
  public async getOtpCodes({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<RegistrationOtpModel>> {
    const codes = await this.dbContext.RegistrationOtpModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<RegistrationOtpModel>>(codes, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: codes.count }, pagination),
    };
  }

  /**
   * Create otp code
   */
  public async createOtpCode(
    payload: CreateOtpCodeDTO,
    options?: CreateOptions<RegistrationOtpModel>,
  ): Promise<RegistrationOtpModel> {
    return this.dbContext.RegistrationOtpModel.create(payload, options);
  }

  /**
   * Update otp code
   */
  public async updateOtpCode(
    payload: UpdateOtpCode,
    options: UpdateOptions<RegistrationOtpModel>,
  ): Promise<[number, RegistrationOtpModel[]]> {
    return this.dbContext.RegistrationOtpModel.update(payload, options);
  }
}
