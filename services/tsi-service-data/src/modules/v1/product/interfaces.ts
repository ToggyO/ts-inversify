/**
 * Description: Interfaces for product entity
 */

import { NextFunction, Request, Response } from 'express';
import { BulkCreateOptions, CreateOptions, DestroyOptions, FindOptions, UpdateOptions } from 'sequelize';

import {
  GetEntityPayload,
  GetEntityResponse,
  GetListResponse,
  GetParameters,
  IBaseService,
  RequestQueries,
} from 'modules/interfaces';
import { ProductModel } from 'modules/v1/product/product.model';
import { VariantItemModel } from 'modules/v1/variant-item/variant-item.model';
import { VariantModel } from 'modules/v1/variant/variant.model';
import { ItemMetaInfoModel } from 'modules/v1/item-meta-info/item-meta-info.model';
import { FavouriteProductModel } from 'modules/v1/favourite-product/favourite-product.model';
import {
  AgeGroup,
  CreateProductDetailsDTO,
  CreateProductDTO,
  CreateProductMediaDTO,
  CreateProductMetaInfoDTO,
  CreateVariantManualDataDTO,
  GetVariantItemsDTO,
  GetVariantMetaInfoDTO,
  ProductMetaInfo,
  UpdateProductTopDTO,
  VariantsDTO,
} from 'modules/v1/product/types';
import { ProductDetailModel } from 'modules/v1/product-detail/product-detail.model';
import { ProductMediaModel } from 'modules/v1/product-media/product-media.model';
import { VariantManualDataModel } from 'modules/v1/variant-manual-data/variant-manual-data.model';

export interface IProductHandler {
  getProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProductsBySearchString(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProductDetailsById(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProductDetailsBySlug(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTop(req: Request, res: Response, next: NextFunction): Promise<void>;
  getVariantData(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAvailableVariantDates(req: Request, res: Response, next: NextFunction): Promise<void>;
  getVariantItems(req: Request, res: Response, next: NextFunction): Promise<void>;
  getVariantItemMetaInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IProductEntityService extends IBaseService {
  getEntityResponse(payload: GetEntityPayload): Promise<GetEntityResponse<ProductModel>>;
  getProducts(userId: number, query: RequestQueries): Promise<GetListResponse<ProductModel>>;
  getProductsBySearchString(query: RequestQueries): Promise<GetListResponse<ProductModel>>;
  getProductById(
    productId: number,
    query: RequestQueries,
    userId: number,
  ): Promise<GetEntityResponse<ProductModel>>;
  getProductBySlug(name: string, query: RequestQueries, userId: number): Promise<ProductModel | null>;
  updateProductTopById(id: number, payload: UpdateProductTopDTO): Promise<GetEntityResponse<ProductModel>>;
  getVariantData(variantId: number, variantItemId: number): Promise<VariantsDTO | null>;
  getAvailableVariantDates(variantId: number): Promise<Array<string> | null>;
  getVariantItems(dto: GetVariantItemsDTO): Promise<GetListResponse<VariantItemModel>>;
  getVariantItemMetaInfo(dto: GetVariantMetaInfoDTO): Promise<Array<AgeGroup> | null>;
}

export interface IProductRepository {
  getProductIdsByDate(startDate: string, endDate: string): Promise<Array<{ id: number }>>;
  getProductIdsByCategoryId(categoryId: number, productIds?: Array<number>): Promise<Array<{ id: number }>>;
  getProducts(payload: GetParameters): Promise<GetListResponse<ProductModel>>;
  getProduct(payload: FindOptions): Promise<ProductModel | null>;
  createProduct(
    payload: Omit<CreateProductDTO, 'categoryIds'> & { currency: string; slug: string },
    options: CreateOptions<ProductModel>,
  ): Promise<ProductModel>;
  createProductMetaInfoBulk(
    payload: Array<CreateProductMetaInfoDTO>,
    options?: BulkCreateOptions<ProductMetaInfo>,
  ): Promise<Array<ProductMetaInfo>>;
  createProductMediaBulk(
    payload: Array<CreateProductMediaDTO>,
    options: BulkCreateOptions<ProductMediaModel>,
  ): Promise<Array<ProductMediaModel>>;
  updateProduct(
    payload: Partial<CreateProductDTO>,
    options: UpdateOptions<ProductModel>,
  ): Promise<[number, ProductModel[]]>;
  updateProductTop(
    payload: UpdateProductTopDTO,
    options: UpdateOptions<ProductModel>,
  ): Promise<[number, ProductModel[]]>;
  updateProductDetails(
    payload: Partial<CreateProductDetailsDTO>,
    options: UpdateOptions<ProductDetailModel>,
  ): Promise<[number, ProductDetailModel[]]>;
  updateProductMetaInfo(
    payload: Partial<ProductMetaInfo>,
    options: UpdateOptions<ProductMetaInfo>,
  ): Promise<[number, ProductMetaInfo[]]>;
  updateProductMedia(
    payload: Partial<CreateProductMediaDTO>,
    options: UpdateOptions<ProductMediaModel>,
  ): Promise<[number, ProductMediaModel[]]>;
  getProductMedia(payload: FindOptions): Promise<ProductMediaModel | null>;
  removeProductMedia(options: DestroyOptions<ProductMediaModel>): Promise<number>;
  getVariants(payload: GetParameters): Promise<GetListResponse<VariantModel>>;
  getVariant(payload: FindOptions): Promise<VariantModel | null>;
  getVariantItems(payload: GetParameters): Promise<GetListResponse<VariantItemModel>>;
  getVariantAvailableDates(variantId: number): Promise<Array<{ 'DATE(vi.start_datetime)': string }>>;
  getVariantItemMetaInfo(payload: FindOptions): Promise<ItemMetaInfoModel | null>;
  getDataFromFavourites(payload: GetParameters): Promise<GetListResponse<FavouriteProductModel>>;
  getVariantManualDataList(payload: GetParameters): Promise<GetListResponse<VariantManualDataModel>>;
  getVariantManualData(payload: FindOptions): Promise<VariantManualDataModel | null>;
  createVariantManualData(
    payload: CreateVariantManualDataDTO,
    options: CreateOptions<VariantManualDataModel>,
  ): Promise<VariantManualDataModel>;
}
