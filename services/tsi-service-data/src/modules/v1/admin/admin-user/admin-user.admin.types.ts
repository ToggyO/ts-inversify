/**
 * Description: Admin - Auth module types
 */

export type CreateAdminDTO = {
  name: string;
  email: string;
  password: string;
  address: string;
  postalCode: string;
  is_activated?: number;
  profileImage?: string;
  phoneNumber?: string;
  landline?: string;
};

export type RestorePasswordAdminDTO = {
  name: string;
  email: string;
  token: string;
};

export type UpdateAdminDTO = {
  name: string;
  email: string;
  address: string;
  postalCode: string;
  phoneNumber: string;
  landline?: string;
};
