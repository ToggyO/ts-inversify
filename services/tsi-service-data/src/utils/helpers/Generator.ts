/**
 * Description: Helper class with payload generator functions
 */

export class Generator {
  /**
   * Generate random password string
   */
  public static generatePassword(): string {
    let pass = '';
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let i = 1; i <= 8; i++) {
      const char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }

    return pass;
  }

  /**
   * Generate random referral code string
   */
  public static generateReferralCode(): string {
    let code = '';
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 1; i <= 16; i++) {
      const char = Math.floor(Math.random() * str.length + 1);

      code += str.charAt(char);
    }

    return code;
  }

  /**
   * Generate random otp code string
   */
  public static generateOtp(): string {
    let code = '';
    const str = '0123456789';

    for (let i = 0; i < 6; i++) {
      const char = Math.floor(Math.random() * str.length);

      code += str.charAt(char);
    }

    return code;
  }

  /**
   * Generate random token restore password process
   */
  public static generateChangePasswordToken(): string {
    let token = '';
    const str = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 36; i++) {
      const char = Math.floor(Math.random() * str.length);

      token += str.charAt(char);
    }

    return token;
  }

  /**
   * Generate Universally Unique Identifier v4
   */
  public static generateUuidV4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Generate universally unique identifier for sales order
   */
  public static generateTransactionUuid(id: number): string {
    return `TSI-TKT-${id}`;
  }
}
