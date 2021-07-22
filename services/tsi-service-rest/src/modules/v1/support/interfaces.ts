/**
 * Description: Interfaces for support module
 */

import { NextFunction, Request, Response } from 'express';

export interface ISupportHandler {
  sendTicket(req: Request, res: Response, next: NextFunction): Promise<void>;
}
