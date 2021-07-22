/**
 * Description: Countries module repository
 */

import { FindOptions } from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { IDbContext } from 'db/interfaces';
import { BaseRepository } from 'modules/common';
import { getProp, autobind } from 'utils/helpers';
import { GetListResponse, GetParameters } from 'modules/interfaces';

import { CountryModel } from './country.model';
import { ICountryRepository } from './types';

@injectable()
export class CountryRepository extends BaseRepository implements ICountryRepository {
  constructor(@inject(TYPES.DbContext) protected readonly dbContext: IDbContext) {
    super();
    autobind(this);
  }

  /**
   * Get list of countries
   */
  public async getCountries({
    where = {},
    attributes,
    include,
    pagination,
    order,
  }: GetParameters): Promise<GetListResponse<CountryModel>> {
    const country = await this.dbContext.CountryModel.findAndCountAll({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
      ...pagination,
      order,
    });
    const items = getProp<Array<CountryModel>>(country, 'rows', []);
    return {
      items,
      ...this.getPaginationResponse({ count: country.count }, pagination),
    };
  }

  /**
   * Get country by id
   */
  public async getCountry({ where = {}, attributes, include }: FindOptions): Promise<CountryModel | null> {
    return this.dbContext.CountryModel.findOne({
      where,
      ...(Array.isArray(attributes) ? { attributes } : {}),
      ...(Array.isArray(include) ? { include } : {}),
    });
  }
}
