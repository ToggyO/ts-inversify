/**
 * Description: Itinerary(Shopping cart) module repository
 */

import { FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';
import { injectable, inject } from 'inversify';

import { BaseRepository } from 'modules/common';
import { TYPES } from 'DIContainer/types';
import { IDbContext } from 'db/interfaces';
import { GetListResponse, GetParameters } from 'modules/interfaces';
import { getProp, autobind } from 'utils/helpers';

import { IItineraryRepository, CreateItineraryDTO, UpdateItineraryDTO } from './types';
import { ItineraryModel } from './itinerary.model';

@injectable()
export class ItineraryRepository extends BaseRepository implements IItineraryRepository {
  constructor(@inject(TYPES.DbContext) protected readonly dbContext: IDbContext) {
    super();
    autobind(this);
  }

  /**
   * Get list of itineraries
   */
  public async getItineraries({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<ItineraryModel>> {
    const itineraries = await this.dbContext.ItineraryModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<ItineraryModel>>(itineraries, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: itineraries.count }, pagination),
    };
  }

  /**
   * Get itinerary
   */
  public async getItinerary({
    where = {},
    attributes,
    include,
  }: FindOptions): Promise<ItineraryModel | null> {
    return this.dbContext.ItineraryModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Create itinerary
   */
  public async createItinerary(
    dto: CreateItineraryDTO,
    options?: CreateOptions<ItineraryModel>,
  ): Promise<ItineraryModel> {
    return this.dbContext.ItineraryModel.create(dto, options);
  }

  /**
   * Update itinerary
   */
  public async updateItinerary(
    dto: Partial<UpdateItineraryDTO>,
    options: UpdateOptions<ItineraryModel>,
  ): Promise<[number, Array<ItineraryModel>]> {
    return this.dbContext.ItineraryModel.update(dto, options);
  }

  /**
   * Delete itinerary
   */
  public async deleteItinerary(options: DestroyOptions<ItineraryModel>): Promise<number> {
    return this.dbContext.ItineraryModel.destroy(options);
  }
}
