/**
 * Description: Category module service
 */

import { inject, injectable } from 'inversify';

import { TYPES } from 'DIContainer/types';
import { BaseService } from 'modules/common';
import { RequestQueries, GetEntityPayload, GetEntityResponse, GetListResponse } from 'modules/interfaces';
import { autobind } from 'utils/helpers';

import { ICategoryEntityService, IECategoryRepository } from './interfaces';
import { ECategoryModel } from './e-category.model';
import { ECategoryModelType } from './types';

@injectable()
export class CategoryService extends BaseService implements ICategoryEntityService {
  constructor(
    @inject(TYPES.IECategoryRepository) protected readonly eCategoryRepository: IECategoryRepository,
  ) {
    super();
    autobind(this);
  }

  /**
   * Get a product as a common answer
   * on operations of creating / editing / getting by id
   */
  public async getECategoryEntityResponse({
    id,
    include,
  }: GetEntityPayload): Promise<GetEntityResponse<ECategoryModel>> {
    const model = ECategoryModel;
    const attributes = this.getModelAttributes<ECategoryModelType>({ model });
    const result = await this.eCategoryRepository.getCategory({
      where: { id },
      attributes,
      include,
    });

    return this.dryDataWithInclude({ model, data: result });
  }

  /**
   * Get list of e-categories
   */
  public async getECategories(query: RequestQueries): Promise<GetListResponse<ECategoryModel>> {
    const pagination = this.getPagination({ query });
    const attributes = this.getModelAttributes<ECategoryModelType>({ model: ECategoryModel });
    return this.eCategoryRepository.getCategories({
      attributes,
      pagination,
    });
  }

  /**
   * Get e-category by id
   */
  public async getECategoryById(
    id: number,
    query: RequestQueries,
  ): Promise<GetEntityResponse<ECategoryModel>> {
    const include = this.getInclude({ query });
    return this.getECategoryEntityResponse({ id, include });
  }
}
