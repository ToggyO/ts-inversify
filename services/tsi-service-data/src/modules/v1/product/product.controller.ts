/**
 * Description: Products module controller for handling products routing
 */

import url from 'url';
import querystring from 'querystring';

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { GetListResponse, RequestQueries } from 'modules/interfaces';
import { ApplicationError, getSuccessRes } from 'utils/response';
import { getProp, autobind } from 'utils/helpers';
import { MICROSERVICES_AUTH_HEADER } from 'constants/common';

import { ProductModel } from './product.model';
import { IProductHandler, IProductEntityService } from './interfaces';
import {
  UpdateProductTopRequest,
  GetVariantWithVariantItemDTO,
  VariantsDTO,
  GetVariantItemsDTO,
  GetVariantMetaInfoDTO,
} from './types';
import { PRODUCT_ERROR_MESSAGES } from './constants';
import { VariantItemModel } from '../variant-item/variant-item.model';

@injectable()
export class ProductController extends BaseController implements IProductHandler {
  constructor(@inject(TYPES.IProductEntityService) protected productService: IProductEntityService) {
    super();
    autobind(this);
  }

  /**
   * Get list of products
   */
  public async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.get(MICROSERVICES_AUTH_HEADER) as string);
      const query = getProp<RequestQueries>(req, 'query', {});
      const resultData = await this.productService.getProducts(userId, query);
      res.status(200).send(
        getSuccessRes<GetListResponse<ProductModel>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product list by `search` string
   */
  public async getProductsBySearchString(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = getProp<RequestQueries>(req, 'query', {});
      const resultData = await this.productService.getProductsBySearchString(query);
      res.status(200).send(
        getSuccessRes<GetListResponse<ProductModel>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product details by id
   */
  public async getProductDetailsById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.get(MICROSERVICES_AUTH_HEADER) as string);
      const id = getProp<number>(req, 'params.id', undefined);

      if (!id) {
        throw new ApplicationError(this.notFoundErrorPayload(PRODUCT_ERROR_MESSAGES.NOT_FOUND('Product')));
      }

      const query = getProp<RequestQueries>(req, 'query', {});

      const resultData = await this.productService.getProductById(id, query, userId);

      if (!resultData) {
        throw new ApplicationError(this.notFoundErrorPayload(PRODUCT_ERROR_MESSAGES.NOT_FOUND('Product')));
      }

      res.status(200).send(
        getSuccessRes<ProductModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product details by `slug` field
   */
  public async getProductDetailsBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.get(MICROSERVICES_AUTH_HEADER) as string);
      const slug = getProp<string>(req, 'params.slug', undefined);
      const query = getProp<RequestQueries>(req, 'query', {});

      const resultData = await this.productService.getProductBySlug(slug, query, userId);
      if (!resultData) {
        throw new ApplicationError(this.notFoundErrorPayload(PRODUCT_ERROR_MESSAGES.NOT_FOUND('Product')));
      }

      res.status(200).send(
        getSuccessRes<ProductModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update the `top` field of the city
   */
  public async updateTop(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);
      const body = getProp<UpdateProductTopRequest>(req, 'body', {});

      if (!id) {
        throw new ApplicationError(this.notFoundErrorPayload(PRODUCT_ERROR_MESSAGES.NOT_FOUND('Product')));
      }

      const resultData = await this.productService.updateProductTopById(id, body);

      if (!id) {
        throw new ApplicationError(this.notFoundErrorPayload(PRODUCT_ERROR_MESSAGES.NOT_FOUND('Product')));
      }

      res.status(200).send(
        getSuccessRes<ProductModel>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Checking availability of the product from Headout api
   */
  public async getVariantData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = getProp<GetVariantWithVariantItemDTO>(req, 'params', {});

      const resultData = await this.productService.getVariantData(params.variantId, params.variantItemId);

      if (!resultData) {
        throw new ApplicationError(this.notFoundErrorPayload(PRODUCT_ERROR_MESSAGES.NOT_FOUND('Variant')));
      }

      res.status(200).send(
        getSuccessRes<VariantsDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get array of available variant dates
   */
  public async getAvailableVariantDates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const variantId = getProp<number>(req, 'params.variantId', null);
      const resultData = await this.productService.getAvailableVariantDates(variantId);
      if (!resultData) {
        throw new ApplicationError(this.notFoundErrorPayload(PRODUCT_ERROR_MESSAGES.NOT_FOUND('Variant')));
      }
      res.status(200).send(
        getSuccessRes<Array<string>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get variant items
   */
  public async getVariantItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = getProp<GetVariantItemsDTO>(req, 'body', {});

      const resultData = await this.productService.getVariantItems(dto);

      res.status(200).send(
        getSuccessRes<GetListResponse<VariantItemModel>>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get variant item meta info by variant item id
   */
  public async getVariantItemMetaInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<GetVariantMetaInfoDTO>(req, 'body', null);

      const resultData = await this.productService.getVariantItemMetaInfo(body);

      res.status(200).send(getSuccessRes({ resultData }));
    } catch (error) {
      next(error);
    }
  }
}
