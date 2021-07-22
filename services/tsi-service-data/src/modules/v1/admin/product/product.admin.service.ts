/**
 * Description: Admin - Products module service
 */

import { Includeable, Transaction } from 'sequelize';
import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IConnector } from 'db/interfaces';
import { BaseService } from 'modules/common';
import { autobind, createSlug } from 'utils/helpers';
import {
  ChangeGalleryPositionDTO,
  CreateProductDetailsDTO,
  CreateProductDTO,
  CreateProductMediaDTO,
  CreateProductMetaInfoDTO,
  IProductRepository,
  ProductIncludeLiterals,
  ProductMediaPositions,
  ProductModel,
} from 'modules/v1/product';
import { IECategoryRepository } from 'modules/v1/e-category';
import { PRODUCT_ERROR_MESSAGES } from 'modules/v1/product/constants';
import { ProductMetaInfoDTO } from 'modules/v1/product/dto/ProductMetaInfoDTO';
import { ApplicationError } from 'utils/response';
import { ERROR_CODES } from 'constants/error-codes';
import { RequestQueries } from 'modules/interfaces';
import { ProductMediaModel } from 'modules/v1/product-media/product-media.model';

import { IProductAdminService } from './product.admin.interfaces';
import { ProductAdminValidator } from './product.admin.validator';

@injectable()
export class ProductAdminService extends BaseService implements IProductAdminService {
  constructor(
    @inject(TYPES.IConnector) private readonly _connector: IConnector,
    @inject(TYPES.IProductRepository) private readonly _productRepository: IProductRepository,
    @inject(TYPES.IECategoryRepository) private readonly _categoryRepository: IECategoryRepository,
  ) {
    super();
    autobind(this);
  }

  /**
   * Create custom product with product details
   */
  public async createProductWithDetails(
    dto: CreateProductDTO & CreateProductDetailsDTO,
  ): Promise<ProductModel> {
    const driedValues = this.dryPayload<CreateProductDTO & CreateProductDetailsDTO>(
      dto,
      this.combinePayloadSchemas([
        this._createUpdateProductPayloadSchema(),
        this._createUpdateProductDetailsPayloadSchema(),
      ]),
    );

    ProductAdminValidator.productValidator(driedValues);
    ProductAdminValidator.productDetailsValidator(driedValues);

    const t = await this._connector.getConnection()?.transaction();
    if (!t) {
      this.throwTransactionError();
    }
    const {
      name,
      articleType,
      categoryIds,
      ratingAvg,
      ratingCount,
      status,
      metaKeyword,
      metaDescription,
      ...productDetails
    } = dto;

    let product: ProductModel;
    try {
      // FIXME: HARDCODE
      const currency = await this._createCurrency();
      product = await this._productRepository.createProduct(
        {
          name,
          articleType,
          ratingAvg,
          ratingCount,
          status,
          currency,
          slug: createSlug(name),
          metaKeyword,
          metaDescription,
          sourceId: 3,
        },
        { transaction: t },
      );
      await product.createProductDetails({ ...productDetails, productId: product.id }, { transaction: t });
      await this._createProductMetaInfo(product.id, t!);
      const eCategories = categoryIds.map((item) => ({
        eCategoryId: item,
        productId: product.id,
      }));
      if (eCategories.length) {
        await this._categoryRepository.createECategoryProductBulk(eCategories, { transaction: t });
      }
      await t?.commit();
    } catch (error) {
      await t?.rollback();
      this.throwTransactionError();
    }
    return product!;
  }

  /**
   * Update product
   */
  public async updateProduct(
    productId: number,
    dto: CreateProductDTO,
    query: RequestQueries,
  ): Promise<Array<Includeable>> {
    await this._checkProductExistence(productId, [ProductIncludeLiterals.ProductDetails]);
    const driedValues = this.dryPayload<CreateProductDTO>(dto, this._createUpdateProductPayloadSchema());
    ProductAdminValidator.productValidator(driedValues);

    await this._productRepository.updateProduct(dto, { where: { id: productId } });
    return this.getInclude({ query });
  }

  /**
   * Update product details
   */
  public async updateProductDetails(
    productId: number,
    dto: CreateProductDetailsDTO,
    query: RequestQueries,
  ): Promise<Array<Includeable>> {
    const product = await this._checkProductExistence(productId, [ProductIncludeLiterals.ProductDetails]);
    const driedValues = this.dryPayload<CreateProductDetailsDTO>(
      dto,
      this._createUpdateProductDetailsPayloadSchema(),
    );
    ProductAdminValidator.productDetailsValidator(driedValues);
    await this._productRepository.updateProductDetails(dto, { where: { id: product.productDetails?.id } });
    return this.getInclude({ query });
  }

  /**
   * Update product meta info
   */
  public async updateProductMetaInfo(
    productId: number,
    metaInfo: ProductMetaInfoDTO,
    query: RequestQueries,
  ): Promise<Array<Includeable>> {
    await this._checkProductExistence(productId, [ProductIncludeLiterals.ProductMetaInfos]);
    const t = await this._connector.getConnection()?.transaction();
    if (!t) {
      this.throwTransactionError();
    }
    try {
      const promiseArray = Object.entries(metaInfo).map(async ([metaKey, metaValue]) =>
        this._productRepository.updateProductMetaInfo(
          {
            metaKey,
            metaValue,
          },
          { where: { productId, metaKey }, transaction: t },
        ),
      );
      await Promise.all(promiseArray);
      await t?.commit();
    } catch (error) {
      await t?.rollback();
      this.throwTransactionError();
    }
    return this.getInclude({ query });
  }

  /**
   * Set `status` field of product to 0 or 1
   */
  public async toggleProductBlock(productId: number, query: RequestQueries): Promise<Array<Includeable>> {
    const product = await this._checkProductExistence(productId);
    const status = product.status === 1 ? 0 : 1;
    await this._productRepository.updateProduct({ status }, { where: { id: productId } });
    return this.getInclude({ query });
  }

  /**
   * Attach set of image urls to product
   */
  public async attachMediaUrls(
    productId: number,
    urls: Array<string>,
    query: RequestQueries,
  ): Promise<Array<Includeable>> {
    const product = await this._checkProductExistence(productId);
    const t = await this._connector.getConnection()?.transaction();
    if (!t) {
      this.throwTransactionError();
    }
    try {
      const media = urls.map(
        (url) =>
          ({
            productId,
            imageUrl: url,
            caption: product.name,
            webPosition: 0,
            mobilePosition: 0,
            status: 1,
          } as CreateProductMediaDTO),
      );
      await this._productRepository.createProductMediaBulk(media, { transaction: t });
      await t?.commit();
    } catch (error) {
      await t?.rollback();
      this.throwTransactionError();
    }
    return this.getInclude({ query });
  }

  /**
   * Set position of image in product media gallery
   */
  public async setGalleryPosition(
    productId: number,
    dto: ChangeGalleryPositionDTO,
    query: RequestQueries,
  ): Promise<Array<Includeable>> {
    const product = await this._checkProductExistence(productId, [ProductIncludeLiterals.ProductMedia]);
    const driedPayload = this.dryPayload<ChangeGalleryPositionDTO>(dto, this._attachMediaPayloadSchema());
    ProductAdminValidator.setGalleryPositionValidator(dto);

    const { productMedia = [] } = product;
    const { id, type, position } = driedPayload;
    const isPositionInUse = productMedia.some((media) => {
      if (type === ProductMediaPositions.Web) {
        return media.webPosition === position;
      }
      if (type === ProductMediaPositions.Mobile) {
        return media.webPosition === position;
      }
      return false;
    });
    if (isPositionInUse) {
      throw new ApplicationError({
        statusCode: 409,
        errorCode: ERROR_CODES.conflict,
        errorMessage: 'Duplicate position',
        errors: [],
      });
    }
    await this._productRepository.updateProductMedia(
      {
        ...(type === ProductMediaPositions.Web ? { webPosition: position } : { mobilePosition: position }),
      },
      { where: { id } },
    );
    return this.getInclude({ query });
  }

  /**
   * Get product media by id
   */
  public async getAsset(assetId: number): Promise<ProductMediaModel> {
    const asset = await this._productRepository.getProductMedia({ where: { id: assetId } });
    if (!asset) {
      throw new ApplicationError({
        statusCode: 404,
        errorCode: ERROR_CODES.not_found,
        errorMessage: "Asset with this identifier doesn't exist",
        errors: [],
      });
    }
    return asset;
  }

  /**
   * Remove an image attached to product
   */
  public async removeAsset(
    productId: number,
    assetId: number,
    query: RequestQueries,
  ): Promise<Array<Includeable>> {
    await this._checkProductExistence(productId);
    await this._productRepository.removeProductMedia({ where: { id: assetId } });
    return this.getInclude({ query });
  }

  /**
   * Get product by id or throw `not found exception`
   */
  private async _checkProductExistence(
    productId: number,
    include?: Array<Includeable>,
  ): Promise<ProductModel> {
    const product = await this._productRepository.getProduct({
      where: { id: productId },
      ...(include ? { include } : {}),
    });
    if (!product) {
      throw new ApplicationError({
        statusCode: 404,
        errorCode: ERROR_CODES.not_found,
        errorMessage: PRODUCT_ERROR_MESSAGES.NOT_FOUND('Product'),
        errors: [],
      });
    }
    return product;
  }

  /**
   * Create currency JSON object
   */
  // TODO: CHECK
  private async _createCurrency(): Promise<string> {
    const currency = {
      code: 'EUR',
      name: 'Euro',
      symbol: 'EUR',
      precision: 2,
      localSymbol: '€',
    };
    return JSON.stringify(currency);
  }

  /**
   * Create empty product meta info items
   */
  private async _createProductMetaInfo(productId: number, transaction?: Transaction): Promise<void> {
    const metaInfo = new ProductMetaInfoDTO();
    const productMetaInfo = Object.entries(metaInfo).map(([metaKey, metaValue]) => ({
      productId,
      metaKey,
      metaValue,
      metaKeyHtml: 'SUMMARY_HTML',
    })) as Array<CreateProductMetaInfoDTO>;
    await this._productRepository.createProductMetaInfoBulk(productMetaInfo, {
      ...(transaction ? { transaction } : {}),
    });
  }

  /**
   * Data transformation schema for create or update product
   */
  private _createUpdateProductPayloadSchema() {
    return {
      name: (value: string) => value,
      articleType: (value: string) => value,
      categoryIds: (value: number) => value,
      ratingAvg: (value: number) => value,
      ratingCount: (value: number) => value,
      status: (value: number) => value,
      metaKeyword: (value: string) => value,
      metaDescription: (value: string) => value,
    };
  }

  /**
   * Data transformation schema for create or update product details
   */
  private _createUpdateProductDetailsPayloadSchema() {
    return {
      startAddressLine1: (value: string) => value,
      startAddressLine2: (value: string) => value,
      startCity: (value: string) => value,
      startCountry: (value: string) => value,
      startPostalCode: (value: string) => value,
      startLatitude: (value: string) => value,
      startLongitude: (value: string) => value,
      hasMobileTicket: (value: string) => value,
      hasAudioAvailable: (value: string) => value,
    };
  }

  /**
   * Data transformation schema for attach media to product
   */
  private _attachMediaPayloadSchema() {
    return {
      id: (value: number) => value,
      position: (value: number) => value,
      type: (value: string) => value,
    };
  }
}
