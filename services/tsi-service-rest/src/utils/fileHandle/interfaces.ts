/**
 * Description: Interfaces for file upload module
 */

import { RequestHandler } from 'express';

export interface IFileHandler<T> {
  Uploader: T;
  uploadSingle(fieldName: string): RequestHandler;
  uploadMany(fieldName: string, maxCount?: number): RequestHandler;
}

export interface IProcessedFile {
  buffer: Buffer;
  size: number;
  mimetype: string;
  originalname: string;
  [libProps: string]: unknown;
}
