/**
 * Description: Products module service
 */

import moment, { Moment } from 'moment';
import momentTimeZone from 'moment-timezone';
import { lookupViaCity } from 'city-timezones';
import { Op, Includeable } from 'sequelize';
import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IConnector } from 'db/interfaces';
import { BaseService } from 'modules/common';
import { RequestQueries, GetEntityPayload, GetEntityResponse, GetListResponse } from 'modules/interfaces';
import { getTimeByPartOfTheDay, isObjectEmpty, autobind } from 'utils/helpers';
import { PartsOfTheDay } from 'constants/parts-of-the-day.enum';
import { ApplicationError } from 'utils/response';
import { ERROR_CODES } from 'constants/error-codes';

import { ProductModel } from './product.model';
import { ProductValidator } from './product.validator';
import { IProductRepository, IProductEntityService } from './interfaces';
import {
  GetVariantItemsDTO,
  ProductModelType,
  UpdateProductTopDTO,
  VariantsDTO,
  GetVariantMetaInfoDTO,
  AgeGroup,
  VariantModelType,
  VariantItemModelType,
  ItemMetaInfoModelType,
} from './types';
import { VariantItemModel } from '../variant-item/variant-item.model';
import { FavouriteProductModel } from '../favourite-product/favourite-product.model';
import { ProductMetaInfoDTO } from './dto/ProductMetaInfoDTO';
import { VariantModel } from '../variant/variant.model';
import { ItemMetaInfoModel } from '../item-meta-info/item-meta-info.model';
import { ICityRepository } from '../city/types';
import { IThreadsPoolConstructor } from 'utils/threads';

function _getAvailableVariantDates(variant: Array<{ 'DATE(vi.start_datetime)': string }>): Array<string> {
  return variant.map((item) => item['DATE(vi.start_datetime)']);
}

@injectable()
export class ProductService extends BaseService implements IProductEntityService {
  constructor(
    @inject(TYPES.IConnector) protected readonly connector: IConnector,
    @inject(TYPES.IProductRepository) protected readonly productRepository: IProductRepository,
    @inject(TYPES.ICityRepository) protected readonly CityRepository: ICityRepository,
    @inject(TYPES.ThreadsPoolConstructor)
    protected readonly _threadsPoolConstructor: IThreadsPoolConstructor<
      Array<{ 'DATE(vi.start_datetime)': string }>,
      Array<string>
    >,
  ) {
    super();
    autobind(this);
    this._threadsPoolConstructor.create({
      size: 4,
      task: _getAvailableVariantDates,
    });
  }

  /**
   * Format date into format `YYYY-MM-DD`
   */
  private formatDate(date: string | Date | Moment): string {
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * Get start date & an end date for range of search for products
   */
  private async getDateRange(
    date: string,
    time: PartsOfTheDay,
    cityId: number,
  ): Promise<{ startDate: string | null; endDate: string | null }> {
    ProductValidator.dateValidator(date);

    const parsedDate = this.formatDate(date);
    let startDate: string | null = null;
    let endDate: string | null = null;
    const notFoundErrorPayload = {
      statusCode: 400,
      errorCode: ERROR_CODES.not_found,
      errorMessage: 'City is not found',
      errors: [],
    };

    if (date && !time) {
      const city = await this.CityRepository.getCity({ where: { id: cityId } });
      if (!city) {
        throw new ApplicationError(notFoundErrorPayload);
      }
      const cityLookup = lookupViaCity(city.name);
      if (!cityLookup.length) {
        throw new ApplicationError(notFoundErrorPayload);
      }
      const timeZone = cityLookup[0].timezone;
      const currentDate = new Date().toLocaleDateString([], { timeZone });
      const incomingDate = new Date(parsedDate).toLocaleDateString([], { timeZone });

      if (currentDate === incomingDate) {
        startDate = `${parsedDate} ${momentTimeZone().tz(timeZone).format('HH:mm:ss')}`;
      } else {
        startDate = `${parsedDate} 00:00:00`;
      }
      endDate = `${parsedDate} 23:59:59`;
    }

    if (date && time) {
      const { startTimeSlot, endTimeSlot } = getTimeByPartOfTheDay(time.toLowerCase() as PartsOfTheDay);
      startDate = `${date} ${startTimeSlot}`;
      endDate = `${date} ${endTimeSlot}`;
    }

    return { startDate, endDate };
  }

  /**
   * Get a product as a common answer
   * on operations of creating / editing / getting by id
   */
  public async getEntityResponse({
    id,
    include,
  }: GetEntityPayload): Promise<GetEntityResponse<ProductModel>> {
    const model = ProductModel;
    const attributes = this.getModelAttributes<ProductModelType>({ model });
    const result = await this.productRepository.getProduct({
      where: { id },
      attributes,
      include,
    });

    return this.dryDataWithInclude({ model, data: result });
  }

  /**
   * Get list of products
   */
  public async getProducts(userId: number, query: RequestQueries): Promise<GetListResponse<ProductModel>> {
    const pagination = this.getPagination({ query });
    const search = this.getSearch({ query, fieldNames: ['name'] });
    const order = this.getSort({ query });
    let include = this.getInclude({ query }) as Array<string | Includeable>;
    const {
      isActive = null,
      withTopActivities = null,
      withMostPopular = null,
      cityId = null,
      categoryId = null,
      date = null,
      time = null,
    } = query;

    if (!include) {
      include = [];
    }

    include.push('city');

    // Helper variable for searching by date or dateTime
    let startDateTime: string | null = null;
    let endDateTime: string | null = null;

    if (date) {
      const { startDate, endDate } = await this.getDateRange(date, time, cityId);
      startDateTime = startDate;
      endDateTime = endDate;
    }

    let productIds: Array<number> = [];
    if (startDateTime && endDateTime) {
      const products = await this.productRepository.getProductIdsByDate(startDateTime, endDateTime);
      productIds = products.map((item) => item.id);
    }

    if (categoryId) {
      const products = await this.productRepository.getProductIdsByCategoryId(categoryId, productIds);
      productIds = products.map((item) => item.id);
    }

    const productAttributes = this.getRequiredModelAttributes<ProductModelType>({
      model: ProductModel,
    });

    if (userId) {
      include.push({
        model: FavouriteProductModel,
        as: 'isFavourite',
        required: false,
        attributes: ['id'],
        where: { userId },
      });
    }

    const products = await this.productRepository.getProducts({
      where: {
        ...(isActive ? { status: JSON.parse(isActive) } : {}),
        ...(search ? { [Op.or]: search } : {}),
        ...(withTopActivities ? { topActivities: JSON.parse(withTopActivities) } : {}),
        ...(withMostPopular ? { mostPopular: JSON.parse(withMostPopular) } : {}),
        ...(parseInt(cityId) ? { cityId } : {}),
        ...(date || categoryId ? { id: { [Op.in]: productIds } } : {}),
      },
      pagination,
      attributes: productAttributes,
      include,
      order: order.length ? order : undefined,
    });

    if (userId) {
      products.items.forEach((product) => {
        let isFavourite = false;
        if (typeof product.isFavourite === 'object' && !isObjectEmpty(product.isFavourite!)) {
          isFavourite = true;
        }
        product.setDataValue('isFavourite', isFavourite);
        return product;
      });
    }

    return products;
  }

  /**
   * Get product list by `search` string
   */
  public async getProductsBySearchString(query: RequestQueries): Promise<GetListResponse<ProductModel>> {
    const pagination = this.getPagination({ query });
    const { search, cityId = null, isActive = null } = query;
    if (!search || search.length < 4) {
      return {
        items: [],
        pagination: {
          ...pagination,
          total: 0,
        },
      };
    }
    const parsedSearch = this.getSearch({ query, fieldNames: ['name'] });
    const order = this.getSort({ query });
    const attributes = this.getModelAttributes<ProductModelType>({ model: ProductModel });

    return this.productRepository.getProducts({
      where: {
        [Op.or]: parsedSearch,
        ...(isActive ? { status: JSON.parse(isActive) } : {}),
        ...(parseInt(cityId) ? { cityId } : {}),
      },
      pagination,
      attributes,
      order: order.length ? order : undefined,
    });
  }

  /**
   * Get product by id
   */
  public async getProductById(
    productId: number,
    query: RequestQueries,
    userId: number,
  ): Promise<GetEntityResponse<ProductModel>> {
    const include = this.getInclude({ query }) as Array<Includeable>;

    if (userId) {
      include.push({
        model: FavouriteProductModel,
        as: 'isFavourite',
        required: false,
        attributes: ['id'],
        where: { userId },
      });
    }

    const product = (await this.getEntityResponse({ id: productId, include })) as ProductModel;
    return this._addFavouriteAndTransformProductMeta(product, userId);
  }

  /**
   * Get product by `slug` field
   */
  public async getProductBySlug(
    slug: string,
    query: RequestQueries,
    userId: number,
  ): Promise<ProductModel | null> {
    const include = this.getInclude({ query }) as Array<Includeable>;

    if (userId) {
      include.push({
        model: FavouriteProductModel,
        as: 'isFavourite',
        required: false,
        attributes: ['id'],
        where: { userId },
      });
    }

    let product = await this.productRepository.getProduct({
      where: {
        slug: {
          [Op.like]: `%${slug}%`,
        },
        status: {
          [Op.gt]: 0,
        },
      },
      include,
    });

    if (!product) {
      return null;
    }

    product = (await this.getEntityResponse({ id: product.id, include })) as ProductModel;
    return this._addFavouriteAndTransformProductMeta(product, userId);
  }

  /**
   * Update the `top` field of the city by id
   */
  public async updateProductTopById(
    productId: number,
    payload: UpdateProductTopDTO,
  ): Promise<GetEntityResponse<ProductModel>> {
    const driedValues = this.dryPayload<UpdateProductTopDTO, Record<string, (arg: any) => any>>(
      payload,
      this.updateProductTopByIdPayload(),
    );

    ProductValidator.updateTopValidator(driedValues);

    await this.productRepository.updateProductTop(
      {
        topActivities: payload.topActivities,
        mostPopular: payload.mostPopular,
      },
      {
        where: { id: productId },
        returning: false,
      },
    );

    return this.getEntityResponse({ id: productId });
  }

  /**
   * Checking availability of the product from Headout api
   */
  public async getVariantData(variantId: number, variantItemId: number): Promise<VariantsDTO | null> {
    ProductValidator.getVariantDataValidator(variantId, variantItemId);

    const attributes = this.getModelAttributes<VariantModelType>({ model: VariantModel });
    const variant = await this.productRepository.getVariant({
      attributes,
      where: { id: variantId },
      include: [
        {
          model: VariantItemModel,
          as: 'variantItemsOfVariants',
          where: {
            id: variantItemId,
          },
        },
      ],
    });

    if (!variant || !variant.variantItemsOfVariants?.length) {
      return null;
    }

    const startDateTime = variant.variantItemsOfVariants[0].startDateTime;
    const endDateTime = variant.variantItemsOfVariants[0].endDateTime;

    return {
      headoutVariantId: variant.variantId,
      variantName: variant.name,
      startDateTime,
      endDateTime,
    };
  }

  /**
   * Get array of available variant dates
   */
  public async getAvailableVariantDates(variantId: number): Promise<Array<string> | null> {
    const variant = await this.productRepository.getVariant({
      where: { id: variantId },
      include: ['variantItemsOfVariants'],
    });
    if (!variant) {
      return null;
    }
    const variantItems = await this.productRepository.getVariantAvailableDates(variantId);
    return this._threadsPoolConstructor.pool.exec(variantItems);
  }

  /**
   * Get variant items
   */
  public async getVariantItems(dto: GetVariantItemsDTO): Promise<GetListResponse<VariantItemModel>> {
    ProductValidator.getVariantItemsValidator(dto);

    const startDate = `${this.formatDate(dto.date)} 00:00:00`;
    const endOfTheStartDay = `${this.formatDate(dto.date)} 23:59:59`;

    const attributes = this.getModelAttributes<VariantItemModelType>({
      model: VariantItemModel,
    });

    return this.productRepository.getVariantItems({
      where: {
        [Op.and]: [
          { variantId: dto.variantId },
          {
            startDateTime: {
              [Op.gte]: startDate,
            },
          },
          {
            endDateTime: {
              [Op.lt]: endOfTheStartDay,
            },
          },
          {
            remaining: {
              [Op.gt]: 0,
            },
          },
        ],
      },
      attributes,
      order: [['startDateTime', 'ASC']],
    });
  }

  /**
   * Get variant item meta info by variant item id
   */
  public async getVariantItemMetaInfo(dto: GetVariantMetaInfoDTO): Promise<Array<AgeGroup> | null> {
    ProductValidator.getVariantItemMetaInfovalidator(dto);

    const attributes = this.getModelAttributes<ItemMetaInfoModelType>({ model: ItemMetaInfoModel });
    const itemMetaInfo = await this.productRepository.getVariantItemMetaInfo({
      attributes,
      where: { itemId: dto.variantItemId },
    });

    if (!itemMetaInfo) {
      return null;
    }

    return itemMetaInfo.metaValue;
  }

  /**
   * Transform product meta info from array to object
   */
  private _transformProductMeta(product: ProductModel): ProductModel {
    const metaInfo = product?.productMetaInfos?.reduce<ProductMetaInfoDTO>((acc, metaInfo) => {
      acc[metaInfo.metaKey as keyof ProductMetaInfoDTO] = metaInfo.metaValue;
      return acc;
    }, new ProductMetaInfoDTO());

    delete product.productMetaInfos;
    product.metaInfo = metaInfo;
    return product;
  }

  /**
   * Add `isFavourite` field to product entity and transform product meta info
   */
  private _addFavouriteAndTransformProductMeta(product: ProductModel, userId: number): ProductModel {
    if (userId) {
      let isFavourite = false;
      if (typeof product.isFavourite === 'object' && !isObjectEmpty(product.isFavourite)) {
        isFavourite = true;
      }
      product.isFavourite = isFavourite;
    }

    if (product?.productMetaInfos?.length) {
      product = this._transformProductMeta(product);
    }

    return product as ProductModel;
  }

  /**
   * Data transformation schema for update product top payload
   */
  private updateProductTopByIdPayload() {
    return {
      id: (value: string): number => parseInt(value),
      topActivities: (value: boolean): boolean => value,
      mostPopular: (value: boolean): boolean => value,
    };
  }
}
