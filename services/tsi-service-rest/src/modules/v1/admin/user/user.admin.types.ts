/**
 * Description: User module types
 */

export type ChangePasswordPayload = { email: string };

export type ChangeEmailDTO = {
  id: number;
  firstName: string;
  lastName: string;
  oldEmail: string;
  newEmail: string;
};
