/**
 * Description: Cities module repository
 */

import { FindOptions, UpdateOptions } from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IDbContext } from 'db/interfaces';
import { BaseRepository } from 'modules/common';
import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, GetParameters } from 'modules/interfaces';

import { ICityRepository, UpdateCityTopPayload } from './types';
import { CityModel } from './city.model';

@injectable()
export class CityRepository extends BaseRepository implements ICityRepository {
  constructor(@inject(TYPES.DbContext) protected readonly dbContext: IDbContext) {
    super();
    autobind(this);
  }
  /**
   * Get list of cities
   */
  public async getCities({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<CityModel>> {
    const cities = await this.dbContext.CityModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<CityModel>>(cities, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: cities.count }, pagination),
    };
  }

  /**
   * Get city
   */
  public async getCity({ where = {}, attributes, include }: FindOptions): Promise<CityModel | null> {
    return this.dbContext.CityModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }

  /**
   * Update the `top` field of the city by id
   */
  public async updateCity(
    payload: UpdateCityTopPayload,
    options: UpdateOptions<CityModel>,
  ): Promise<[number, CityModel[]]> {
    return this.dbContext.CityModel.update(payload, options);
  }
}
