/**
 * Description: User module constants
 */

export const USER_ERROR_MESSAGES = {
  NOT_FOUND: "User with this identifier doesn't exist",
  NOT_FOUND_PRODUCT: "Product with this identifier doesn't exist",
  INVALID_OTP: 'Provided otp code is invalid',
  WRONG_LOGIN_CREDENTIALS: "User doesn't exist or password is wrong",
  INVALID_FAVOURITES_ACTION: 'Choose an action `add` or `remove`',
  CANT_UPDATE_PROFILE: `You can't update your profile info. Please, use method, specified for user,
    signed in with social network`,
  CANT_UPDATE_PROFILE_IMAGE_WITH_SOCIAL: (socialType: string) =>
    `You can't update your profile image, if you are signed in with ${socialType}`,
  INVALID_OLD_PASSWORD: 'Old password is invalid',
  INVALID_RESTORE_PASSWORD_TOKEN: 'Invalid token',
  NOT_UNIQUE: (fieldName: string) => `Field "${fieldName}" must be unique`,
  CHANGE_EMAIL_ERROR: 'Provide a valid email, different from the current one',
} as const;
