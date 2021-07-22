/**
 * Description: Admin - Auth module types
 */

export type Admin = {
  id: number;
  name: string;
  email: string;
  emailVerifiedAt: string;
  password: string;
  profileImage: string;
  phoneNumber: string;
  landline: string;
  address: string;
  postalCode: string;
  isActivated: number;
  rememberToken: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RestorePasswordAdminDTO = {
  name: string;
  email: string;
  token: string;
};
