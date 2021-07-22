/**
 * Description: Products module repository
 */

import {
  FindOptions,
  UpdateOptions,
  QueryTypes,
  CreateOptions,
  BulkCreateOptions,
  DestroyOptions,
} from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IConnector, IDbContext } from 'db/interfaces';
import { BaseRepository } from 'modules/common';
import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, GetParameters } from 'modules/interfaces';

import { ProductModel } from './product.model';
import { IProductRepository } from './interfaces';
import {
  CreateProductDetailsDTO,
  CreateProductDTO,
  CreateProductMediaDTO,
  CreateProductMetaInfoDTO,
  CreateVariantManualDataDTO,
  ProductMetaInfo,
  UpdateProductTopDTO,
} from './types';
import { VariantItemModel } from '../variant-item/variant-item.model';
import { VariantModel } from '../variant/variant.model';
import { ItemMetaInfoModel } from '../item-meta-info/item-meta-info.model';
import { FavouriteProductModel } from '../favourite-product/favourite-product.model';
import { ProductDetailModel } from '../product-detail/product-detail.model';
import { ProductMediaModel } from '../product-media/product-media.model';
import { VariantManualDataModel } from '../variant-manual-data/variant-manual-data.model';

@injectable()
export class ProductRepository extends BaseRepository implements IProductRepository {
  constructor(
    @inject(TYPES.DbContext) protected readonly dbContext: IDbContext,
    @inject(TYPES.IConnector) protected readonly connector: IConnector,
  ) {
    super();
    autobind(this);
  }

  /**
   * Get a set of product id by start date/end date from variant_items table
   */
  public async getProductIdsByDate(startDate: string, endDate: string): Promise<Array<{ id: number }>> {
    const sequelize = this.connector.getConnection();
    const alias = 'p';
    const sql = `
      SELECT ${alias}.id
        FROM variant_items vi
        JOIN variants v ON v.id = vi.variant_id
        JOIN products ${alias} ON ${alias}.id = v.product_id
        WHERE vi.start_datetime  >= '${startDate}'
        AND vi.end_datetime < '${endDate}'
      GROUP BY ${alias}.id
    `;
    const items = await sequelize?.query<ProductModel>(sql, { type: QueryTypes.SELECT });
    return items as Array<{ id: number }>;
  }

  /**
   * Get a set of product id by category id and set of product id from another filter
   */
  public async getProductIdsByCategoryId(
    categoryId: number,
    productIds: Array<number>,
  ): Promise<Array<{ id: number }>> {
    const sequelize = this.connector.getConnection();
    const alias = 'p';
    const searchWithProductIds = ` AND ${alias}.id IN (${productIds?.join(', ')})`;
    const sql = `
      SELECT ${alias}.id
        FROM e_category_products ecp
        JOIN products p ON ${alias}.id = ecp.product_id
        WHERE ecp.e_category_id = ${categoryId}${productIds.length ? searchWithProductIds : ''}
    `;
    const items = await sequelize?.query(sql, { type: QueryTypes.SELECT });
    return items as Array<{ id: number }>;
  }

  /**
   * Get list of products
   */
  public async getProducts({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<ProductModel>> {
    const products = await this.dbContext.ProductModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<ProductModel>>(products, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: products.count }, pagination),
    };
  }

  /**
   * Get product
   */
  public async getProduct({ where = {}, attributes, include }: FindOptions): Promise<ProductModel | null> {
    return this.dbContext.ProductModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Create product
   */
  public async createProduct(
    payload: Omit<CreateProductDTO, 'categoryIds'> & { currency: string; slug: string },
    options: CreateOptions<ProductModel>,
  ): Promise<ProductModel> {
    return this.dbContext.ProductModel.create(payload, options);
  }

  /**
   * Create product meta info (Bulk)
   */
  public async createProductMetaInfoBulk(
    payload: Array<CreateProductMetaInfoDTO>,
    options?: BulkCreateOptions<ProductMetaInfo>,
  ): Promise<Array<ProductMetaInfo>> {
    return this.dbContext.ProductMetaInfoModel.bulkCreate(payload, options);
  }

  /**
   * Create product media (Bulk)
   */
  public async createProductMediaBulk(
    payload: Array<CreateProductMediaDTO>,
    options: BulkCreateOptions<ProductMediaModel>,
  ): Promise<Array<ProductMediaModel>> {
    return this.dbContext.ProductMediaModel.bulkCreate(payload, options);
  }

  /**
   * Create product
   */
  public async updateProduct(
    payload: Partial<CreateProductDTO>,
    options: UpdateOptions<ProductModel>,
  ): Promise<[number, ProductModel[]]> {
    return this.dbContext.ProductModel.update(payload, options);
  }

  /**
   * Update the `top` field of the city by id
   */
  public async updateProductTop(
    payload: UpdateProductTopDTO,
    options: UpdateOptions<ProductModel>,
  ): Promise<[number, ProductModel[]]> {
    return this.dbContext.ProductModel.update(payload, options);
  }

  /**
   * Update product details
   */
  public async updateProductDetails(
    payload: Partial<CreateProductDetailsDTO>,
    options: UpdateOptions<ProductDetailModel>,
  ): Promise<[number, ProductDetailModel[]]> {
    return this.dbContext.ProductDetailModel.update(payload, options);
  }

  /**
   * Update product details
   */
  public async updateProductMetaInfo(
    payload: Partial<ProductMetaInfo>,
    options: UpdateOptions<ProductMetaInfo>,
  ): Promise<[number, ProductMetaInfo[]]> {
    return this.dbContext.ProductMetaInfoModel.update(payload, options);
  }

  /**
   * Update product media
   */
  public async updateProductMedia(
    payload: Partial<CreateProductMediaDTO>,
    options: UpdateOptions<ProductMediaModel>,
  ): Promise<[number, ProductMediaModel[]]> {
    return this.dbContext.ProductMediaModel.update(payload, options);
  }

  /**
   * Get product media
   */
  public async getProductMedia({
    where = {},
    attributes,
    include,
  }: FindOptions): Promise<ProductMediaModel | null> {
    return this.dbContext.ProductMediaModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Remove product media
   */
  public async removeProductMedia(options: DestroyOptions<ProductMediaModel>): Promise<number> {
    return this.dbContext.ProductMediaModel.destroy(options);
  }

  /**
   * Get list of variants
   */
  public async getVariants({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<VariantModel>> {
    const variants = await this.dbContext.VariantModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<VariantModel>>(variants, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: variants.count }, pagination),
    };
  }

  /**
   * Get variant
   */
  public async getVariant({ where = {}, attributes, include }: FindOptions): Promise<VariantModel | null> {
    return this.dbContext.VariantModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Get variant items by variantId and and date of choosen variant
   */
  public async getVariantItems({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<VariantItemModel>> {
    const variantItems = await this.dbContext.VariantItemModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<VariantItemModel>>(variantItems, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: variantItems.count }, pagination),
    };
  }

  /**
   * Get array of available variant dates
   */
  public async getVariantAvailableDates(
    variantId: number,
  ): Promise<Array<{ 'DATE(vi.start_datetime)': string }>> {
    const sequelize = this.connector.getConnection();
    const sql = `SELECT  DATE(vi.start_datetime)
        FROM variant_items vi 
        JOIN variants v ON v.id = vi.variant_id 
        WHERE v.id = ${variantId}
        AND vi.start_datetime >= CURDATE()
      GROUP BY DATE(vi.start_datetime);
    `;
    const items = await sequelize?.query<{ 'DATE(vi.start_datetime)': string }>(sql, {
      type: QueryTypes.SELECT,
    });
    return items as Array<{ 'DATE(vi.start_datetime)': string }>;
  }

  /**
   * Get variant item meta info
   */
  public async getVariantItemMetaInfo({
    where = {},
    attributes,
    include,
  }: FindOptions): Promise<ItemMetaInfoModel | null> {
    return this.dbContext.ItemMetaInfoModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Get variant item meta info
   */
  public async getDataFromFavourites({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<FavouriteProductModel>> {
    const favourites = await this.dbContext.FavouriteProductModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<FavouriteProductModel>>(favourites, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: favourites.count }, pagination),
    };
  }

  /**
   * Get variant manual data list
   */
  public async getVariantManualDataList({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<VariantManualDataModel>> {
    const favourites = await this.dbContext.VariantManualDataModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<VariantManualDataModel>>(favourites, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: favourites.count }, pagination),
    };
  }

  /**
   * Get variant manual data
   */
  public async getVariantManualData({
    where = {},
    attributes,
    include,
  }: FindOptions): Promise<VariantManualDataModel | null> {
    return this.dbContext.VariantManualDataModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Create product
   */
  public async createVariantManualData(
    payload: CreateVariantManualDataDTO,
    options: CreateOptions<VariantManualDataModel>,
  ): Promise<VariantManualDataModel> {
    return this.dbContext.VariantManualDataModel.create(payload, options);
  }
}
