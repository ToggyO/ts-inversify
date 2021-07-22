/**
 * Description: Extended express Request interface declaration
 */

import { Request } from 'express';

import { JWTTokenPayload, Session } from 'utils/authentication';

export declare type NoInferType<T> = [T][T extends any ? 0 : never];

export declare type FunctionType = (...args: Array<any>) => any;

export declare type BufferEncoding =
  | 'ascii'
  | 'utf8'
  | 'utf-8'
  | 'utf16le'
  | 'ucs2'
  | 'ucs-2'
  | 'base64'
  | 'latin1'
  | 'binary'
  | 'hex';

export interface ExtendedRequest extends Request {
  session?: Session;
  user?: JWTTokenPayload;
}

export interface ExtendedSession extends Express.Session {
  guestId?: number;
  token?: string;
}
