/**
 * Description: Admin - Products module interfaces
 */

import { Includeable } from 'sequelize';

import {
  ChangeGalleryPositionDTO,
  CreateProductDetailsDTO,
  CreateProductDTO,
  ProductModel,
} from 'modules/v1/product';
import { NextFunction, Request, Response } from 'express';

import { RequestQueries } from 'modules/interfaces';
import { ProductMetaInfoDTO } from 'modules/v1/product/dto/ProductMetaInfoDTO';
import { ProductMediaModel } from 'modules/v1/product-media/product-media.model';

export interface IProductAdminHandler {
  createProductWithDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProductDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProductMetaInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleProductBlock(req: Request, res: Response, next: NextFunction): Promise<void>;
  attachMediaUrls(req: Request, res: Response, next: NextFunction): Promise<void>;
  setGalleryPosition(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeAsset(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IProductAdminService {
  createProductWithDetails(dto: CreateProductDTO & CreateProductDetailsDTO): Promise<ProductModel>;
  updateProduct(id: number, dto: CreateProductDTO, query: RequestQueries): Promise<Array<Includeable>>;
  updateProductDetails(
    productId: number,
    dto: CreateProductDetailsDTO,
    query: RequestQueries,
  ): Promise<Array<Includeable>>;
  updateProductMetaInfo(
    productId: number,
    metaInfo: ProductMetaInfoDTO,
    query: RequestQueries,
  ): Promise<Array<Includeable>>;
  toggleProductBlock(productId: number, query: RequestQueries): Promise<Array<Includeable>>;
  attachMediaUrls(productId: number, urls: Array<string>, query: RequestQueries): Promise<Array<Includeable>>;
  setGalleryPosition(
    productId: number,
    dto: ChangeGalleryPositionDTO,
    query: RequestQueries,
  ): Promise<Array<Includeable>>;
  getAsset(assetId: number): Promise<ProductMediaModel>;
  removeAsset(productId: number, assetId: number, query: RequestQueries): Promise<Array<Includeable>>;
}
