/**
 * Description: Countries module service
 */

import sequelize from 'sequelize';
import { injectable, inject } from 'inversify';

import { BaseService } from 'modules/common';
import { RequestQueries, GetEntityPayload, GetEntityResponse, GetListResponse } from 'modules/interfaces';
import { autobind } from 'utils/helpers';

import { CountryModel } from './country.model';
import { CountryModelType, ICountryEntityService, ICountryRepository } from './types';
import { TYPES } from 'DIContainer/types';

@injectable()
export class CountryService extends BaseService implements ICountryEntityService {
  constructor(@inject(TYPES.ICountryRepository) protected readonly CountryRepository: ICountryRepository) {
    super();
    autobind(this);
  }

  /**
   * Get a country as a common answer
   * on operations of creating / editing / getting by id
   */
  public async getEntityResponse({
    id,
    include,
  }: GetEntityPayload): Promise<GetEntityResponse<CountryModel>> {
    const model = CountryModel;
    const attributes = this.getModelAttributes<CountryModelType>({ model });
    const result = await this.CountryRepository.getCountry({
      where: { id },
      attributes,
      include,
    });

    return this.dryDataWithInclude({ model, data: result });
  }

  /**
   * Get list of countries
   */
  public async getCountries(query: RequestQueries): Promise<GetListResponse<CountryModel>> {
    const pagination = this.getPagination({ query });
    const attributes = this.getModelAttributes<CountryModelType>({ model: CountryModel });
    return this.CountryRepository.getCountries({
      attributes,
      pagination,
    });
  }

  /**
   * Get country by id
   */
  public async getCountryById(
    countryId: number,
    query?: RequestQueries,
  ): Promise<GetEntityResponse<CountryModel>> {
    return this.getEntityResponse({ id: countryId });
  }

  /**
   * Get a list of country alphanumeric codes stored in the database
   */
  public async getAlphaCodes(): Promise<Pick<CountryModel, 'id' & 'code'>> {
    return this.CountryRepository.getCountries({
      attributes: ['id', [sequelize.fn('lower', sequelize.col('code')), 'code']],
    });
  }

  /**
   * Geе a list of country dialing codes stored in the database
   */
  public async getDialCodes(): Promise<Pick<CountryModel, 'id' & 'dialCode'>> {
    return this.CountryRepository.getCountries({ attributes: ['id', 'dialCode'] });
  }
}
