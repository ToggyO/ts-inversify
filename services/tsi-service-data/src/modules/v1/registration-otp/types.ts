/**
 * Description: Types and interfaces for registration-otp entity
 */

import { CreateOptions, UpdateOptions } from 'sequelize';

import { GetListResponse, GetParameters } from 'modules/interfaces';

import { RegistrationOtpModel } from './registration-otp.model';

export interface IRegistrationOtpRepository {
  getOtpCodes(oprions: GetParameters): Promise<GetListResponse<RegistrationOtpModel>>;
  createOtpCode(
    payload: CreateOtpCodeDTO,
    options?: CreateOptions<RegistrationOtpModel>,
  ): Promise<RegistrationOtpModel>;
  updateOtpCode(
    payload: UpdateOtpCode,
    options: UpdateOptions<RegistrationOtpModel>,
  ): Promise<[number, RegistrationOtpModel[]]>;
}

export type CreateOtpCodeDTO = {
  email: string;
  phoneNumber: string;
  otp: string;
  expireAt: string;
};

export type UpdateOtpCode = {
  status: number;
};
