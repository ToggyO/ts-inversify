/**
 * Description: Admin - Products module controller
 */

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { getSuccessRes } from 'utils/response';
import { getProp, autobind } from 'utils/helpers';
import {
  ChangeGalleryPositionDTO,
  CreateProductDetailsDTO,
  CreateProductDTO,
  IProductEntityService,
  ProductIncludeLiterals,
  ProductModel,
} from 'modules/v1/product';
import { ProductMetaInfoDTO } from 'modules/v1/product/dto/ProductMetaInfoDTO';

import { IProductAdminHandler, IProductAdminService } from './product.admin.interfaces';
import { RequestQueries } from 'modules/interfaces';

@injectable()
export class ProductAdminController extends BaseController implements IProductAdminHandler {
  constructor(
    @inject(TYPES.IProductAdminService) private readonly _adminService: IProductAdminService,
    @inject(TYPES.IProductEntityService) private readonly _productService: IProductEntityService,
  ) {
    super();
    autobind(this);
  }

  /**
   * Create custom product with product details
   */
  public async createProductWithDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<CreateProductDTO & CreateProductDetailsDTO>(req, 'body', {});

      const product = await this._adminService.createProductWithDetails(body);
      const resultData = await this._productService.getEntityResponse({
        id: product.id,
        include: [ProductIncludeLiterals.ProductDetails, ProductIncludeLiterals.ProductMetaInfos],
      });

      res.status(200).send(
        getSuccessRes<ProductModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product
   */
  public async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, body, query } = this._getParams<CreateProductDTO>(req, 'productId');
      const include = await this._adminService.updateProduct(id, body, query);
      const resultData = await this._productService.getEntityResponse({ id, include });

      res.status(200).send(
        getSuccessRes<ProductModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product details
   */
  public async updateProductDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, body, query } = this._getParams<CreateProductDetailsDTO>(req, 'productId');
      const include = await this._adminService.updateProductDetails(id, body, query);
      const resultData = await this._productService.getEntityResponse({ id, include });
      res.status(200).send(
        getSuccessRes<ProductModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product meta info
   */
  public async updateProductMetaInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, body, query } = this._getParams<ProductMetaInfoDTO>(req, 'productId');
      const include = await this._adminService.updateProductMetaInfo(id, body, query);
      const resultData = await this._productService.getEntityResponse({ id, include });
      res.status(200).send(
        getSuccessRes<ProductModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set `status` field of product to 0 or 1
   */
  public async toggleProductBlock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, query } = this._getParams<ProductMetaInfoDTO>(req, 'productId');
      const include = await this._adminService.toggleProductBlock(id, query);
      const resultData = await this._productService.getEntityResponse({ id, include });
      res.status(200).send(
        getSuccessRes<ProductModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Attach set of image urls to product
   */
  public async attachMediaUrls(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, body, query } = this._getParams<{ productMedia: Array<string> }>(req, 'productId');
      const include = await this._adminService.attachMediaUrls(id, body.productMedia, query);
      const resultData = await this._productService.getEntityResponse({ id, include });
      res.status(200).send(
        getSuccessRes<ProductModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set position of image in product media gallery
   */
  public async setGalleryPosition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, body, query } = this._getParams<ChangeGalleryPositionDTO>(req, 'productId');
      const include = await this._adminService.setGalleryPosition(id, body, query);
      const resultData = await this._productService.getEntityResponse({ id, include });
      res.status(200).send(
        getSuccessRes<ProductModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove an image attached to product
   */
  public async removeAsset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, body, query } = this._getParams<{ assetId: number }>(req, 'productId');
      const asset = await this._adminService.getAsset(body.assetId);
      const include = await this._adminService.removeAsset(id, body.assetId, query);
      const product = await this._productService.getEntityResponse({ id, include });
      res.status(200).send(
        getSuccessRes<{ imageUrl: string; product: ProductModel }>({
          resultData: {
            product: product!,
            imageUrl: asset.imageUrl,
          },
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}
