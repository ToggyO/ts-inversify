/**
 * Description: Itinerary item module repository
 */

import { FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';
import { injectable, inject } from 'inversify';

import { BaseRepository } from 'modules/common';
import { TYPES } from 'DIContainer/types';
import { IDbContext } from 'db/interfaces';
import { GetListResponse, GetParameters } from 'modules/interfaces';
import { getProp, autobind } from 'utils/helpers';

import { CreateItineraryItemDTO, IItineraryItemRepository, UpdateItineraryItemDTO } from './types';
import { ItineraryItemModel } from './itinerary-item.model';

@injectable()
export class ItineraryItemRepository extends BaseRepository implements IItineraryItemRepository {
  constructor(@inject(TYPES.DbContext) protected readonly dbContext: IDbContext) {
    super();
    autobind(this);
  }

  /**
   * Get list of itinerary items
   */
  public async getItineraryItems({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<ItineraryItemModel>> {
    const itineraryItems = await this.dbContext.ItineraryItemModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<ItineraryItemModel>>(itineraryItems, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: itineraryItems.count }, pagination),
    };
  }

  /**
   * Get itinerary item
   */
  public async getItineraryItem({
    where = {},
    attributes,
    include,
  }: FindOptions): Promise<ItineraryItemModel | null> {
    return this.dbContext.ItineraryItemModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Create itinerary item
   */
  public async createItineraryItem(
    dto: CreateItineraryItemDTO,
    options?: CreateOptions<ItineraryItemModel>,
  ): Promise<ItineraryItemModel> {
    return this.dbContext.ItineraryItemModel.create(dto, options);
  }

  /**
   * Update itinerary item
   */
  public async updateItineraryItem(
    dto: Partial<UpdateItineraryItemDTO>,
    options: UpdateOptions<ItineraryItemModel>,
  ): Promise<[number, Array<ItineraryItemModel>]> {
    return this.dbContext.ItineraryItemModel.update(dto, options);
  }

  /**
   * Delete itinerary item
   */
  public async deleteItineraryItem(options: DestroyOptions<ItineraryItemModel>): Promise<number> {
    return this.dbContext.ItineraryItemModel.destroy(options);
  }
}
