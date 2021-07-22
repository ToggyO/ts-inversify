/**
 * Description: Admin - Product module interfaces
 */

import { NextFunction, Request, Response } from 'express';

export interface IProductAdminHandler {
  getProductDetailsById(req: Request, res: Response, next: NextFunction): Promise<void>;
  createProductWithDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProductDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProductMetaInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleProductBlock(req: Request, res: Response, next: NextFunction): Promise<void>;
  attachImagesToProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
  setGalleryPosition(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeAsset(req: Request, res: Response, next: NextFunction): Promise<void>;
}
