/**
 * Description: Itinerary(Shopping cart) module service
 */

import moment, { Moment, unitOfTime } from 'moment';
import { Sequelize, Op, Transaction } from 'sequelize';
import { iterate } from 'iterare';
import { inject, injectable } from 'inversify';

import { IConfiguration } from 'config';
import { IConnector } from 'db/interfaces';
import { TYPES } from 'DIContainer/types';
import { BaseService } from 'modules/common';
import { ApplicationError } from 'utils/response';
import { ERROR_CODES } from 'constants/error-codes';
import { CronExpression } from 'constants/cron-expressions.enum';
import { GetEntityPayload, GetEntityResponse } from 'modules/interfaces';
import { Cron } from 'utils/scheduler';
import { autobind } from 'utils/helpers';

import { ItineraryModel } from './itinerary.model';
import {
  ItineraryItemDTO,
  IItineraryEntityService,
  IItineraryRepository,
  ManageItineraryDTO,
  AgeGroupOptions,
  GetItineraryWithItemsDTO,
  CreateItineraryWithItemDTO,
  AddItineraryItem,
  ItineraryModelType,
  ItineraryItemModelType,
  RemoveItineraryItemDTO,
  UpdateItemOfItineraryDTO,
} from './types';
import { ItineraryValidator } from './itinerary.validator';
import { IItineraryItemRepository, ItineraryItemModel } from '../itinerary-item';
import { HeadoutPersons, IProductRepository, ProductModel, ProductModelType } from '../product';
import { ITINERARY_ERROR_MESSAGES } from './constants';
import { PRODUCT_ERROR_MESSAGES } from '../product/constants';

@injectable()
export class ItineraryService extends BaseService implements IItineraryEntityService {
  protected readonly cartLifetimeAmount: number;
  protected readonly cartLifetimeUnit: unitOfTime.DurationConstructor;

  constructor(
    @inject(TYPES.IConfiguration) protected readonly configService: IConfiguration,
    @inject(TYPES.IItineraryRepository) protected readonly itineraryRepository: IItineraryRepository,
    @inject(TYPES.IItineraryItemRepository)
    protected readonly itineraryItemRepository: IItineraryItemRepository,
    @inject(TYPES.IProductRepository) protected readonly ProductRepository: IProductRepository,
    @inject(TYPES.IConnector) protected readonly connector: IConnector,
  ) {
    super();
    autobind(this);
    const CART_LIFE_TIME_AMOUNT = configService.get<string>('CART_LIFE_TIME_AMOUNT', '');
    const CART_LIFE_TIME_UNIT = configService.get<string>('CART_LIFE_TIME_UNIT');
    this.cartLifetimeAmount = isNaN(parseInt(CART_LIFE_TIME_AMOUNT)) ? 30 : parseInt(CART_LIFE_TIME_AMOUNT);
    this.cartLifetimeUnit = (CART_LIFE_TIME_UNIT as unitOfTime.DurationConstructor) || 'minutes';
  }

  /**
   * Get a product as a common answer
   * on operations of creating / editing / getting by id
   */
  public async getEntityResponse({
    id,
    include,
  }: GetEntityPayload): Promise<GetEntityResponse<ItineraryModel>> {
    const model = ItineraryModel;
    const attributes = this.getModelAttributes<ItineraryModelType>({ model });
    const result = await this.itineraryRepository.getItinerary({
      where: { id },
      attributes,
      include,
    });

    return this.dryDataWithInclude({ model, data: result });
  }

  /**
   * Get shopping cart of current authenticated user or guest
   */
  public async getItineraryWithItems(dto: GetItineraryWithItemsDTO): Promise<ItineraryModel | null> {
    const itineraryAttributes = this.getModelAttributes<ItineraryModelType>({ model: ItineraryModel });
    const itineraryItemAttributes = this.getModelAttributes<ItineraryItemModelType>({
      model: ItineraryItemModel,
    });

    const currentStartOfTheDate = moment().startOf('day').format('YYYY-MM-DD');
    const itinerary = await this.itineraryRepository.getItinerary({
      attributes: itineraryAttributes,
      where: {
        ...(dto.userId ? { userId: dto.userId } : { guestId: dto.guestId }),
        ...(dto.userId ? {} : { expireAt: { [Op.gte]: Sequelize.fn('NOW') } }),
      },
      include: [
        {
          model: ItineraryItemModel,
          as: 'itemsOfItineraries',
          attributes: itineraryItemAttributes,
          where: {
            itineraryDate: {
              [Op.gte]: currentStartOfTheDate,
            },
            isBooked: {
              [Op.eq]: 0,
            },
          },
        },
      ],
    });

    if (itinerary && Array.isArray(itinerary?.itemsOfItineraries)) {
      const promiseArray = itinerary.itemsOfItineraries.map(async (item) => {
        const product = await item.getProductOfItineraryItem();
        item.setDataValue('imageUrl', product.imageUrl);
      });
      await Promise.all(promiseArray);
    }
    return itinerary;
  }

  /**
   * Create itinerary or update existed by adding new item
   */
  public async manageItinerary(dto: ManageItineraryDTO): Promise<ItineraryItemDTO | null> {
    const driedValues = this.dryPayload<ManageItineraryDTO>(dto, this.createOrUpdateItineraryPayloadSchema());

    if (!driedValues.userId && !driedValues.guestId) {
      this.throwIdentityError();
    }

    ItineraryValidator.manageItineraryValidator(driedValues);
    this._checkRequiringAnAttendant(driedValues.ageGroupOptions);

    const itineraryDate = this.formatDate(dto.itineraryDate);
    const itineraryAttributes = this.getModelAttributes<ItineraryModelType>({ model: ItineraryModel });
    const productAttributes = this.getModelAttributes<ProductModelType>({ model: ProductModel });

    const itinerary = await this.itineraryRepository.getItinerary({
      attributes: itineraryAttributes,
      where: {
        ...(dto.userId ? { userId: dto.userId } : { guestId: dto.guestId }),
        ...(dto.userId ? {} : { expireAt: { [Op.gte]: Sequelize.fn('NOW') } }),
      },
    });

    const product = await this.ProductRepository.getProduct({
      attributes: productAttributes,
      where: { id: dto.productId },
    });

    if (!product) {
      throw new ApplicationError({
        statusCode: 404,
        errorCode: ERROR_CODES.not_found,
        errorMessage: PRODUCT_ERROR_MESSAGES.NOT_FOUND('Product'),
        errors: [],
      });
    }

    if (!itinerary) {
      return this.createItineraryWithItem({
        ...dto,
        itineraryDate,
        productName: product.name,
        headoutProductId: product.productId,
        sourceId: product?.sourceId,
      });
    }

    const { items } = await this.itineraryItemRepository.getItineraryItems({
      where: {
        itineraryId: itinerary.id,
        variantItemId: dto.variantItemId,
        isBooked: {
          [Op.eq]: 0,
        },
      },
    });

    if (items?.length) {
      throw new ApplicationError({
        statusCode: 409,
        errorCode: ERROR_CODES.conflict,
        errorMessage: ITINERARY_ERROR_MESSAGES.IS_EXISTS,
        errors: [],
      });
    }

    return this.addItineraryItem({
      ...dto,
      itineraryDate,
      itineraryId: itinerary.id,
      productName: product.name,
      headoutProductId: product.productId,
      sourceId: product?.sourceId,
    });
  }

  /**
   * Update itinerary items
   */
  public async updateItinerary(dto: UpdateItemOfItineraryDTO): Promise<number | null> {
    const driedValues = this.dryPayload<UpdateItemOfItineraryDTO>(dto, this.updateItineraryPayloadSchema());

    if (!driedValues.userId && !driedValues.guestId) {
      this.throwIdentityError();
    }

    ItineraryValidator.updateItineraryValidator(driedValues);
    this._checkRequiringAnAttendant(driedValues.itineraryItem.ageGroupOptions);

    const { userId, guestId, itineraryId, itineraryItem } = driedValues;
    const itineraryAttributes = this.getModelAttributes<ItineraryModelType>({ model: ItineraryModel });

    const itinerary = await this.itineraryRepository.getItinerary({
      attributes: itineraryAttributes,
      where: {
        ...(userId ? { userId } : { guestId }),
        id: itineraryId,
      },
    });

    if (!itinerary) {
      return null;
    }

    const totalPrice = itineraryItem.ageGroupOptions.reduce((acc, option) => (acc += option.totalPrice), 0);
    const updatedRows = await this.itineraryItemRepository.updateItineraryItem(
      {
        totalPrice,
        productOptions: JSON.stringify(itineraryItem.ageGroupOptions),
      },
      {
        where: {
          id: itineraryItem.id,
        },
      },
    );

    return updatedRows[0];
  }

  /**
   * Remove itinerary with items
   */
  public async removeItineraryWithItems(itineraryId: number): Promise<number> {
    return this.itineraryRepository.deleteItinerary({
      where: { id: itineraryId },
    });
  }

  /**
   * Remove itinerary item from existed itinerary
   */
  public async removeItineraryItem(dto: RemoveItineraryItemDTO): Promise<number> {
    const attributes = this.getModelAttributes<ItineraryModelType>({ model: ItineraryModel });
    const { items } = await this.itineraryRepository.getItineraries({
      attributes,
      where: {
        ...(dto.userId ? { userId: dto.userId } : { guestId: dto.guestId }),
        ...(dto.userId ? {} : { expireAt: { [Op.gte]: Sequelize.fn('NOW') } }),
      },
    });

    if (!items.length) {
      return 0;
    }

    const itineraryId = items[0].id;
    return this.itineraryItemRepository.deleteItineraryItem({
      where: {
        id: dto.itineraryItemId,
        itineraryId,
      },
    });
  }

  /**
   * Format date into format `YYYY-MM-DD`
   */
  private formatDate(date: string | Date | Moment): string {
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * @CRON
   * Remove expired guest itineraries
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'removeExpiredItineraries' })
  private async removeExpiredItineraries(): Promise<void> {
    await this.itineraryRepository.deleteItinerary({
      where: {
        expireAt: { [Op.lt]: Sequelize.fn('NOW') },
      },
    });
  }

  /**
   * Create itinerary item
   */
  private createItineraryItem(dto: AddItineraryItem, transaction?: Transaction) {
    const totalPrice = dto.ageGroupOptions.reduce((acc, option) => (acc += option.totalPrice), 0);
    return this.itineraryItemRepository.createItineraryItem(
      {
        totalPrice,
        itineraryId: dto.itineraryId,
        itineraryDate: dto.itineraryDate,
        productId: dto.productId,
        headoutProductId: dto.headoutProductId,
        position: 2,
        dateTime: dto.slotDateTime,
        variantId: dto.variantId,
        headoutVariantId: dto.headoutVariantId,
        variantName: dto.variantName,
        variantItemId: dto.variantItemId,
        headoutVariantItemId: dto.headoutVariantItemId,
        productName: dto.productName,
        productOptions: JSON.stringify(dto.ageGroupOptions),
        source: dto.sourceId || 1,
      },
      { transaction },
    );
  }

  /**
   * Create itinerary with itinerary item
   */
  private async createItineraryWithItem(dto: CreateItineraryWithItemDTO): Promise<ItineraryItemDTO | null> {
    const t = await this.connector.getConnection()?.transaction();
    if (!t) {
      this.throwTransactionError();
    }

    let result: ItineraryItemDTO | null = null;
    try {
      const itinerary = await this.itineraryRepository.createItinerary(
        {
          ...(dto.userId ? { userId: dto.userId } : { guestId: dto.guestId }),
          ...(!dto.userId
            ? { expireAt: moment.utc().add(this.cartLifetimeAmount, this.cartLifetimeUnit).toISOString() }
            : {}),
          name: `London ${dto.userId ? dto.userId : dto.guestId}`,
          status: 1,
        },
        { transaction: t },
      );
      const item = await this.createItineraryItem({ ...dto, itineraryId: itinerary.id }, t);
      await t?.commit();

      result = {
        itineraryId: item.itineraryId,
        itineraryItemId: item.id,
        itineraryDate: dto.itineraryDate,
      };
    } catch (error) {
      await t?.rollback();
      this.throwTransactionError();
    }

    return result;
  }

  /**
   * Create itinerary item to existed itinerary
   */
  private async addItineraryItem(dto: AddItineraryItem): Promise<ItineraryItemDTO | null> {
    const t = await this.connector.getConnection()?.transaction();
    let result: ItineraryItemDTO | null = null;

    if (!t) {
      this.throwTransactionError();
    }

    try {
      const item = await this.createItineraryItem({ ...dto, itineraryId: dto.itineraryId }, t);
      await t?.commit();

      result = {
        itineraryId: item.itineraryId,
        itineraryItemId: item.id,
        itineraryDate: dto.itineraryDate,
      };
    } catch (error) {
      await t?.rollback();
      this.throwTransactionError();
    }

    return result;
  }

  /**
   * Set `isBooked` field value to 1 for each itinerary item of set of
   * itinerary items by user id or guest id
   */
  public async bookItineraryItems(dto: GetItineraryWithItemsDTO): Promise<void> {
    const itinerary = await this.getItineraryWithItems(dto);

    if (!itinerary) {
      throw new ApplicationError({
        statusCode: 404,
        errorCode: ERROR_CODES.not_found,
        errorMessage: PRODUCT_ERROR_MESSAGES.NOT_FOUND('Product'),
        errors: [],
      });
    }

    const itineraryItemsIds = (itinerary.itemsOfItineraries ?? []).map((item) => item.id);
    const t = await this.connector.getConnection()?.transaction();
    if (!t) {
      this.throwTransactionError();
    }

    try {
      await this.itineraryItemRepository.updateItineraryItem(
        { isBooked: 1 },
        { where: { id: { [Op.in]: itineraryItemsIds } } },
      );
      await t?.commit();
    } catch (error) {
      await t?.rollback();
      this.throwTransactionError();
    }
  }

  /**
   * Check if an accompanying is needed for the group
   */
  private _checkRequiringAnAttendant(ageGroupOptions: Array<AgeGroupOptions>): void {
    const accompanying = [];
    const accompanied = [];
    ageGroupOptions.forEach((option) => {
      if (option.orderedQty <= 0) {
        return;
      }
      const isInfant = option.name.toLowerCase() === HeadoutPersons.Infant.toLowerCase();
      const isChild = option.name.toLowerCase() === HeadoutPersons.Child.toLowerCase();
      if (isInfant || isChild) {
        accompanied.push(option.name);
        return;
      }
      accompanying.push(option.name);
      return;
    }, 0);
    if (accompanied.length && !accompanying.length) {
      throw new ApplicationError({
        statusCode: 409,
        errorCode: ERROR_CODES.conflict,
        errorMessage: ITINERARY_ERROR_MESSAGES.ATTENDANT_REQUIRED,
        errors: [],
      });
    }
  }

  /**
   * Data transformation schema for create itinerary and itinerary items
   */
  private createOrUpdateItineraryPayloadSchema(): Record<string, (arg: any) => any> {
    return {
      userId: (value: number | null) => value,
      guestId: (value: number | null) => value,
      itineraryDate: (value: string) => value,
      variantId: (value: number) => value,
      productId: (value: number) => value,
      variantItemId: (value: number) => value,
      slotDateTime: (value: string) => value,
      ageGroupOptions: (value: Array<AgeGroupOptions>) => value,
      headoutVariantId: (value: number) => value,
      headoutVariantItemId: (value: number) => value,
      headoutProductId: (value: number) => value,
      variantName: (value: number) => value,
    };
  }

  /**
   * Data transformation schema for update itinerary items by itinerary id and user id or guest id
   */
  private updateItineraryPayloadSchema(): Record<string, (arg: any) => any> {
    return {
      userId: (value: number | null) => value,
      guestId: (value: number | null) => value,
      itineraryId: (value: number) => value,
      itineraryItem: (value: { id: number; ageGroupOptions: Array<AgeGroupOptions> }) => value,
    };
  }
}
