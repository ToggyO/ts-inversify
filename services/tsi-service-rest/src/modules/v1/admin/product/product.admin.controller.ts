/**
 * Description: Admin - Product module controller
 */

import { NextFunction, Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { stringify } from 'qs';
import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { RequestQueries } from 'modules/interfaces';
import { ERROR_CODES } from 'constants/error-codes';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { PRODUCT_MEDIA_FIELD_NAME } from 'constants/file-upload';
import { autobind, getProp } from 'utils/helpers';
import {
  ChangeGalleryPositionDTO,
  CreateProductDetailsDTO,
  CreateProductDTO,
  Product,
  ProductMetaInfoDTO,
} from 'modules/v1/product';
import { IProcessedFile } from 'utils/fileHandle';
import { ICloudinaryHelpers } from 'utils/cloudinary';
import { ApplicationError, getSuccessRes, Success } from 'utils/response';

import { IProductAdminHandler } from './product.admin.interfaces';

const { ADMIN, getDataServiceUrl } = SERVICE_ENDPOINTS;

@injectable()
export class ProductAdminController extends BaseController implements IProductAdminHandler {
  constructor(@inject(TYPES.ICloudinaryHelpers) protected readonly _cloudinaryHelpers: ICloudinaryHelpers) {
    super();
    autobind(this);
  }

  /**
   * Get product details by id
   */
  public async getProductDetailsById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getProp<number>(req, 'params.id', undefined);
      const query = getProp<RequestQueries>(req, 'query', {});
      const stringedQuery = stringify(query, { addQueryPrefix: true });

      const response: AxiosResponse<Success<Product>> = await this.axios.get(
        getDataServiceUrl(ADMIN.PRODUCTS.GET_PRODUCT_DETAILS_BY_ID(id, stringedQuery)),
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { data } = response;
      const { resultData } = data;

      res.status(200).send(
        getSuccessRes<Product>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create custom product with product details
   */
  public async createProductWithDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<CreateProductDTO & CreateProductDetailsDTO>(req, 'body', {});
      const response: AxiosResponse<Success<Product>> = await this.axios.post(
        getDataServiceUrl(ADMIN.PRODUCTS.CREATE_REQUEST),
        body,
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<Product>({ resultData }),
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
      const { id, body, stringedQuery } = this._getParams<CreateProductDTO>(req, 'productId');
      const response: AxiosResponse<Success<Product>> = await this.axios.put(
        getDataServiceUrl(ADMIN.PRODUCTS.UPDATE_REQUEST(id, stringedQuery)),
        body,
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<Product>({ resultData }),
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
      const { id, body, stringedQuery } = this._getParams<CreateProductDetailsDTO>(req, 'productId');
      const response: AxiosResponse<Success<Product>> = await this.axios.put(
        getDataServiceUrl(ADMIN.PRODUCTS.UPDATE_DETAILS_REQUEST(id, stringedQuery)),
        body,
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<Product>({ resultData }),
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
      const { id, body, stringedQuery } = this._getParams<ProductMetaInfoDTO>(req, 'productId');
      const response: AxiosResponse<Success<Product>> = await this.axios.put(
        getDataServiceUrl(ADMIN.PRODUCTS.UPDATE_META_INFO_REQUEST(id, stringedQuery)),
        body,
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<Product>({ resultData }),
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
      const { id, stringedQuery } = this._getParams(req, 'productId');
      const response: AxiosResponse<Success<Product>> = await this.axios.get(
        getDataServiceUrl(ADMIN.PRODUCTS.TOGGLE_BLOCK_REQUEST(id, stringedQuery)),
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<Product>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Attach a set of images to product
   */
  public async attachImagesToProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = getProp<Array<IProcessedFile>>(req, 'files', []);
      if (!files) {
        throw new ApplicationError({
          statusCode: 409,
          errorCode: ERROR_CODES.conflict,
          errorMessage: 'File is required',
          errors: [],
        });
      }

      const promiseArray = files.map(async (file) =>
        this._cloudinaryHelpers.uploadBuffer(file.buffer, file.mimetype),
      );
      const urls = await Promise.all<string>(promiseArray);

      const { id, stringedQuery } = this._getParams(req, 'productId');
      const response: AxiosResponse<Success<Product>> = await this.axios.post(
        getDataServiceUrl(ADMIN.PRODUCTS.ATTACH_MEDIA_REQUEST(id, stringedQuery)),
        { [PRODUCT_MEDIA_FIELD_NAME]: urls },
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;

      res.status(200).send(
        getSuccessRes<Product>({ resultData }),
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
      const { id, body, stringedQuery } = this._getParams<ChangeGalleryPositionDTO>(req, 'productId');
      const response: AxiosResponse<Success<Product>> = await this.axios.put(
        getDataServiceUrl(ADMIN.PRODUCTS.GALLERY_POSITION_REQUEST(id, stringedQuery)),
        body,
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;
      res.status(200).send(
        getSuccessRes<Product>({ resultData }),
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
      const { id, body, stringedQuery } = this._getParams<{ assetId: number }>(req, 'productId');
      const response: AxiosResponse<Success<{ imageUrl: string; product: Product }>> = await this.axios.post(
        getDataServiceUrl(ADMIN.PRODUCTS.REMOVE_ASSET_REQUEST(id, stringedQuery)),
        body,
      );
      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }
      const { resultData } = response.data;

      const publicId = this._cloudinaryHelpers.getPublicImageIdFromUrl(resultData.imageUrl);
      if (publicId) {
        this._cloudinaryHelpers.destroy(publicId);
      }

      res.status(200).send(
        getSuccessRes<Product>({ resultData: resultData.product }),
      );
    } catch (error) {
      next(error);
    }
  }
}
