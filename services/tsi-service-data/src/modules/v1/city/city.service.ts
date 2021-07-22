/**
 * Description: Cities module service
 */

import { Op } from 'sequelize';
import { injectable, inject } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseService } from 'modules/common';
import { RequestQueries, GetEntityPayload, GetEntityResponse, GetListResponse } from 'modules/interfaces';
import { autobind } from 'utils/helpers';

import { ICityRepository } from './types';
import { CityModel } from './city.model';
import { CityValidator } from './city.validator';
import { CityModelType, ICityEntityService, UpdateCityTopPayload } from './types';

@injectable()
export class CityService extends BaseService implements ICityEntityService {
  constructor(@inject(TYPES.ICityRepository) protected readonly CityRepository: ICityRepository) {
    super();
    autobind(this);
  }

  /**
   * Get a city as a common answer
   * on operations of creating / editing / getting by id
   */
  public async getEntityResponse({ id, include }: GetEntityPayload): Promise<GetEntityResponse<CityModel>> {
    const model = CityModel;
    const attributes = this.getModelAttributes<CityModelType>({ model });
    const result = await this.CityRepository.getCity({
      where: { id },
      attributes,
      include,
    });

    return this.dryDataWithInclude({ model, data: result });
  }

  /**
   * Get list of cities
   */
  public async getCities(query: RequestQueries): Promise<GetListResponse<CityModel>> {
    const pagination = this.getPagination({ query });
    const search = this.getSearch({ query, fieldNames: ['name'] });
    const order = this.getSort({ query });
    const { withTopDestination = 'false', withTopToVisit = 'false' } = query;

    const cityAttributes = this.getModelAttributes<CityModelType>({ model: CityModel });

    return this.CityRepository.getCities({
      where: {
        ...(search ? { [Op.or]: search } : {}),
        ...(JSON.parse(withTopDestination) ? { topDestination: true } : {}),
        ...(JSON.parse(withTopToVisit) ? { topToVisit: true } : {}),
      },
      pagination,
      attributes: cityAttributes,
      order: order.length ? order : undefined,
    });
  }

  /**
   * Get city
   */
  public async getCityById(cityId: number, query: RequestQueries): Promise<GetEntityResponse<CityModel>> {
    const include = this.getInclude({ query });
    return this.getEntityResponse({ id: cityId, include });
  }

  /**
   * Update the `top` field of the city by id
   */
  public async updateCityTopById(
    cityId: number,
    payload: UpdateCityTopPayload,
  ): Promise<GetEntityResponse<CityModel>> {
    const driedValues = this.dryPayload<UpdateCityTopPayload, Record<string, (arg: any) => any>>(
      payload,
      this.updateCityTopByIdPayload(),
    );

    CityValidator.updateTopValidator(driedValues);

    await this.CityRepository.updateCity(
      {
        topDestination: payload.topDestination,
        topToVisit: payload.topToVisit,
      },
      {
        where: { id: cityId },
        returning: false,
      },
    );

    return this.getEntityResponse({ id: cityId });
  }

  /**
   * Data transformation schema for update city top payload
   */
  private updateCityTopByIdPayload() {
    return {
      id: (value: string): number => parseInt(value),
      topDestination: (value: boolean): boolean => value,
      topToVisit: (value: boolean): boolean => value,
    };
  }
}
