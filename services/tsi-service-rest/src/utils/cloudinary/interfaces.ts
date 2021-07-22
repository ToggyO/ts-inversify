/**
 * Description: Interfaces for Cloudinary service
 */

import { UploadApiOptions } from 'cloudinary';

export interface ICloudinaryHelpers {
  uploadBuffer(buffer: Buffer, mimeType: string, options?: UploadApiOptions): Promise<string>;
  destroy(publicId: string): Promise<void>;
  getPublicImageIdFromUrl(url: string): string | null;
}
