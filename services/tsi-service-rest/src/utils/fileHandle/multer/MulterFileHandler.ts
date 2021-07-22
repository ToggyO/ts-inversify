/**
 * Description: Class described Multer file handler
 */

import { RequestHandler } from 'express';
import multer from 'multer';
import { injectable, inject } from 'inversify';

import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { ApplicationError } from 'utils/response';
import { SUPPORTED_MIME_TYPES, MimeTypes } from 'constants/file-upload';
import { ERROR_CODES } from 'constants/error-codes';

import { IFileHandler } from '../interfaces';

@injectable()
export class MulterFileHandler implements IFileHandler<multer.Multer> {
  private readonly _multer: multer.Multer;

  constructor(@inject(TYPES.IConfiguration) private readonly configService: IConfiguration) {
    const multerOptions = this.onModuleInit();
    this._multer = multer(multerOptions);
  }

  public get Uploader(): multer.Multer {
    return this._multer;
  }

  public uploadSingle(fieldName: string): RequestHandler {
    return this._multer.single(fieldName);
  }

  public uploadMany(fieldName: string, maxCount?: number): RequestHandler {
    return this._multer.array(fieldName, maxCount);
  }

  private onModuleInit(): multer.Options {
    const maxFileSizeMb = this.configService.get<number>('UPLOAD_MAX_FILESIZE_MB', 5);
    return {
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        const allowedFileType = SUPPORTED_MIME_TYPES[file.mimetype as MimeTypes];
        if (!allowedFileType) {
          return cb(
            new ApplicationError({
              statusCode: 400,
              errorCode: ERROR_CODES.validation,
              errorMessage: 'Unsupported file type',
              errors: [],
            }),
          );
        }

        return cb(null, true);
      },
      limits: { fileSize: Number(maxFileSizeMb) * 1024 * 1024 },
    };
  }
}
