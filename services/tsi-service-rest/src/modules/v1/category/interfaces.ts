/**
 * Description: Interfaces for category module
 */

import { NextFunction, Request, Response } from 'express';

export interface ICategoryHandler {
  getECategories(req: Request, res: Response, next: NextFunction): Promise<void>;
}
