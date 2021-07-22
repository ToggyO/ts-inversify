/**
 * Description: Interfaces for authentication helpers
 */

import { NextFunction, Request, Response } from 'express';
import { ExtendedRequest, ExtendedSession } from 'declaration';
import { CustomersIds, IAuthorizeMiddleware, JWTTokenPayload } from 'utils/authentication/types';

export interface IIdentityHelpers {
  generateToken(payload: JWTTokenPayload): string;
  sessionChecker(req: Request, res: Response, next: NextFunction): Promise<void>;
  authenticate(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  authorize(allowedUserStatuses: Array<number> | null): IAuthorizeMiddleware;
  authorizeAdmin(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
  checkToken<T>(token: string): T | null;
  checkTokenAsync<T>(token: string): Promise<any | T>;
  getCustomerIds(session: ExtendedSession): Promise<CustomersIds>;
}
