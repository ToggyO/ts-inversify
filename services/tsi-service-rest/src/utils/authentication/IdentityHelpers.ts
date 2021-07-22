/**
 * Description: Class described authentication helpers
 */

import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { ExtendedRequest, ExtendedSession } from 'declaration';
import { IConfiguration } from 'config';
import { TYPES } from 'DIContainer/types';
import { ERROR_CODES, unauthorizedErrorPayload } from 'constants/error-codes';
import { ApplicationError } from 'utils/response';
import { autobind, generateUid, getProp, randomNumber } from 'utils/helpers';
import { IRedisHelpers } from 'utils/redis';
import { ILogger } from 'utils/logger';

import { IIdentityHelpers } from './interfaces';
import {
  CustomersIds,
  IAuthorizeMiddleware,
  JWTTokenAdminPayload,
  JWTTokenPayload,
  JWTTokenUserPayload,
  Session,
} from './types';
import { BlockStatuses } from 'constants/block-statuses';

@injectable()
export class IdentityHelpers implements IIdentityHelpers {
  protected readonly IDENTITY_HEADER: string;
  protected readonly JWT_SECRET: string;
  protected readonly SESSION_MAX_AGE: string;
  protected readonly TSI_REDIS_TOKEN_PREFIX: string;

  constructor(
    @inject(TYPES.IConfiguration) protected readonly configService: IConfiguration,
    @inject(TYPES.ILogger) protected readonly logger: ILogger,
    @inject(TYPES.IRedisHelpers) protected readonly redisHelpers: IRedisHelpers,
  ) {
    autobind(this);
    const IDENTITY_HEADER = this.configService.get<string>('IDENTITY_HEADER');
    const JWT_SECRET = this.configService.get<string>('JWT_SECRET');
    const SESSION_MAX_AGE = this.configService.get<string>('SESSION_MAX_AGE', '10m');

    if (!IDENTITY_HEADER || !JWT_SECRET) {
      throw new Error('Identity header, JWT secret and cookie name is required');
    }

    this.IDENTITY_HEADER = IDENTITY_HEADER;
    this.JWT_SECRET = JWT_SECRET;
    this.SESSION_MAX_AGE = SESSION_MAX_AGE;
    this.TSI_REDIS_TOKEN_PREFIX = this.configService.get<string>('TSI_REDIS_TOKEN_PREFIX', '');
  }

  /**
   * Generate JWT token
   */
  public generateToken(payload: JWTTokenPayload): string {
    return jwt.sign(
      {
        ...payload,
        type: 'access',
      },
      this.JWT_SECRET,
      { expiresIn: this.SESSION_MAX_AGE },
    );
  }

  /**
   * Check incoming session id
   */
  public async sessionChecker(req: Request, res: Response, next: NextFunction): Promise<void> {
    if ((req as ExtendedRequest).session) {
      return next();
    }

    if (req.url.startsWith('/api-rest/swagger')) {
      return next();
    }

    let sessionId = req.get(this.IDENTITY_HEADER) || req.get(this.IDENTITY_HEADER.toLowerCase()) || '';
    if (!sessionId) {
      sessionId = generateUid();
    }

    let session = await this.redisHelpers.getAndDeserializeAsync<Session>(
      `${this.TSI_REDIS_TOKEN_PREFIX}_${sessionId}`,
    );
    if (!session) {
      session = this.createSessionObject(sessionId);
    }

    (req as ExtendedRequest).session = this.getSessionChangeHandler(session);
    res.setHeader(this.IDENTITY_HEADER, sessionId);
    next();
  }

  /**
   * Check user authentication middleware
   */
  public async authenticate(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    const session = getProp<Session>(req, 'session', {});
    if (!session) {
      throw new ApplicationError(unauthorizedErrorPayload);
    }

    const token = getProp<string>(session, 'token', null);
    if (!token) {
      throw new ApplicationError(unauthorizedErrorPayload);
    }

    let userData: JWTTokenPayload;
    try {
      userData = jwt.verify(token, this.JWT_SECRET) as JWTTokenPayload;
    } catch (error) {
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        delete req.session!.token;
        delete req.session!.user;
        throw new ApplicationError(unauthorizedErrorPayload);
      }

      throw error;
    }

    req.user = userData;
    next();
  }

  /**
   * Check user authorization middleware
   */
  public authorize(allowedUserStatuses: Array<number> | null = null): IAuthorizeMiddleware {
    return async (req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> => {
      const user = req.user as JWTTokenUserPayload;
      if (!user || (allowedUserStatuses !== null && !allowedUserStatuses.includes(user.status))) {
        throw new ApplicationError({
          statusCode: 403,
          errorMessage: 'Permission denied',
          errorCode: ERROR_CODES.security__no_permissions,
          errors: [],
        });
      }
      if (user.isBlocked === BlockStatuses.Blocked) {
        throw new ApplicationError({
          statusCode: 403,
          errorMessage: 'User is blocked',
          errorCode: ERROR_CODES.security__blocked,
          errors: [],
        });
      }
      next();
    };
  }

  /**
   * Check admin authorization middleware
   */
  public async authorizeAdmin(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    const admin = req.user as JWTTokenAdminPayload;
    if (!admin || !admin.isAdmin) {
      throw new ApplicationError({
        statusCode: 403,
        errorMessage: 'Permission denied',
        errorCode: ERROR_CODES.security__no_permissions,
        errors: [],
      });
    }
    next();
  }

  /**
   * Check if JWT token is valid
   */
  public checkToken<T>(token: string): T | null {
    let payload: T | null = null;
    jwt.verify(token, this.JWT_SECRET, (err, decoded) => {
      payload = decoded as any;
    });
    return payload;
  }

  /**
   * Check if JWT token is valid asynchronous
   */
  public async checkTokenAsync<T>(token: string): Promise<any | T> {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        throw new ApplicationError(unauthorizedErrorPayload);
      }
      throw error;
    }
  }

  /**
   * Get user id and guest id from session object
   */
  async getCustomerIds(session: ExtendedSession): Promise<CustomersIds> {
    let userId = null;
    let guestId = null;

    if (session.token) {
      const jwtPayload = this.checkToken<JWTTokenPayload>(session.token);
      userId = jwtPayload?.id ?? null;
    }

    if (session.guestId) {
      guestId = session.guestId;
    } else {
      guestId = this.generateGuestId();
      session.guestId = guestId;
    }

    return { userId, guestId };
  }

  /**
   * Generate guest id
   */
  private generateGuestId(): number {
    return randomNumber(1111111, 9999999);
  }

  /**
   * Create session object
   */
  private createSessionObject(sessionId: string): Session {
    return { sessionId };
  }

  /**
   * Warps session object into Proxy, to save session into Redis on change
   */
  private getSessionChangeHandler(session: Session): Session {
    return new Proxy(session, {
      set: (target: Session, key: keyof Session, value): boolean => {
        let descriptor = Object.getOwnPropertyDescriptor(target, key);
        if (!descriptor) {
          descriptor = {
            value,
            writable: true,
            enumerable: true,
            configurable: false,
          };
        } else {
          descriptor.value = value;
        }
        Object.defineProperty(target, key, descriptor);
        this.redisHelpers.serializeAndSetWithExpiration(
          `${this.TSI_REDIS_TOKEN_PREFIX}_${session.sessionId}`,
          target,
        );
        if (target.user) {
          this.redisHelpers.serializeAndSetWithExpiration(`${target.user.id}`, session.sessionId);
        }
        return true;
      },

      deleteProperty: (target: Session, key: keyof Session): boolean => {
        if (key in target) {
          delete target[key];
          this.redisHelpers.serializeAndSetWithExpiration(
            `${this.TSI_REDIS_TOKEN_PREFIX}_${session.sessionId}`,
            target,
          );
        }
        return true;
      },
    });
  }
}
