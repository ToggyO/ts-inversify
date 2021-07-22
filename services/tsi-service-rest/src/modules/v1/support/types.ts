/**
 * Description: Types for support entity
 */

export type SendTicketDTO = {
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
};

export type SendReplyDTO = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type SendTemporaryPasswordDTO = {
  name: string;
  email: string;
  temporaryPassword: string;
};

export type SendChangeEmailDTO = {
  email: string;
  firstName: string;
  link?: string;
};
