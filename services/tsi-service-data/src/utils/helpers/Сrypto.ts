/**
 * Description: Helper class with cryptographic functionality
 */
import crypto from 'crypto';

import { CRYPTO_SECRET } from 'constants/env';

export class Crypto {
  private static algorithm = 'aes-192-cbc';

  private static key = crypto.scryptSync(CRYPTO_SECRET as crypto.BinaryLike, 'salt', 24);

  private static iv = Buffer.alloc(16, 0);

  /**
   * Encrypt string
   * @param {string} string - string to encrypt
   * @returns {string} - hash
   */
  public static encrypt(string: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(string, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Decrypt string
   * @param {string} encryptedString - string to decrypt
   * @returns {string} - decrypted string
   */
  public static decrypt(encryptedString: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedString, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Hash password
   * @param {string} password
   * @returns {string} - hash
   */
  public static hashPassword(password: string): string {
    return crypto.pbkdf2Sync(password, this.key, 2048, 32, 'sha512').toString('hex');
  }

  /**
   * Compare password with hashed password
   * @param {string} password
   * @param {string} passwordHash - hashed password
   * @returns {boolean} - equivalence of password and hashed password
   */
  public static verifyPassword(password: string, passwordHash: string): boolean {
    const hash = crypto.pbkdf2Sync(password, this.key, 2048, 32, 'sha512').toString('hex');
    return passwordHash === hash;
  }
}
