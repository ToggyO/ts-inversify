/**
 * Description: Class described Cloudinary helpers
 * See: https://cloudinary.com/documentation/node_integration
 */

import cloudinary, { UploadApiOptions } from 'cloudinary';
import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { ApplicationError } from 'utils/response';
import { ERROR_CODES } from 'constants/error-codes';
import { MimeTypes, SUPPORTED_MIME_TYPES } from 'constants/file-upload';

import { ICloudinaryHelpers } from './interfaces';
import { getFileExtension } from 'utils/helpers';

@injectable()
export class CloudinaryHelpers implements ICloudinaryHelpers {
  private readonly _instance = cloudinary.v2;

  constructor(@inject(TYPES.IConfiguration) private readonly configService: IConfiguration) {
    this.onModuleInit();
  }

  public uploadBuffer(buffer: Buffer, mimeType: string, options?: UploadApiOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.uploader
        .upload_stream(
          {
            format: SUPPORTED_MIME_TYPES[mimeType as MimeTypes] || 'png',
            ...options,
          },
          (error, result) => {
            if (error) {
              return reject(this.throwCloudinaryError(error.error.message));
            }
            return resolve(result?.url);
          },
        )
        .end(buffer);
    });
  }

  public async destroy(publicId: string): Promise<void> {
    await this._instance.uploader.destroy(publicId, {
      resource_type: 'image',
    });
  }

  public getPublicImageIdFromUrl(url: string): string | null {
    if (!url) {
      return null;
    }
    const splittedDate = url.split('/');
    const result = getFileExtension(splittedDate[splittedDate.length - 1]);
    return result[0];
  }

  private onModuleInit() {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
    this._instance.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  private throwCloudinaryError(errorMessage: string): void {
    throw new ApplicationError({
      statusCode: 500,
      errorCode: ERROR_CODES.internal_server_error,
      errorMessage,
      errors: [],
    });
  }
}
