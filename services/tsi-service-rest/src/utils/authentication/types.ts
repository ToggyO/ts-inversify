/**
 * Description: Types for authentication helpers
 */

import { NextFunction, Response } from 'express';

import { ExtendedRequest } from 'declaration';
import { BlockStatuses } from 'constants/block-statuses';

export type JWTTokenUserPayload = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: number;
  isBlocked: BlockStatuses;
};

export type JWTTokenAdminPayload = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
};

export type JWTTokenPayload = JWTTokenUserPayload | JWTTokenAdminPayload;

export type IAuthorizeMiddleware = (req: ExtendedRequest, res: Response, next: NextFunction) => Promise<void>;

export type CustomersIds = {
  userId: number | null;
  guestId: number | null;
};

export type Session = {
  sessionId: string;
  token?: string;
  user?: JWTTokenPayload;
  guestId?: number;
};
