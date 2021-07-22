/**
 * Description: Admin - Products module validator
 */

import { BaseValidator } from 'modules/common';
import { Validator, ValidatorError } from 'utils/validation';

import {
  ChangeGalleryPositionDTO,
  CreateProductDetailsDTO,
  CreateProductDTO,
  ProductArticleTypes,
  ProductMediaPositions,
  ProductMetaInfo,
} from 'modules/v1/product';

export class ProductAdminValidator extends BaseValidator {
  /**
   * Create or update product validator
   */
  public static productValidator(dto: CreateProductDTO): void {
    const { name, articleType, categoryIds, ratingAvg, ratingCount, status } = dto;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: name, field: 'name' }).required().result(),
      ...new Validator({ value: articleType, field: 'articleType' })
        .required()
        .enumeration([ProductArticleTypes.Place, ProductArticleTypes.Event])
        .result(),
      ...new Validator({ value: categoryIds, field: 'categoryIds' }).required().isArray('number').result(),
      ...new Validator({ value: ratingAvg, field: 'ratingAvg' }).required().isNumber().result(),
      ...new Validator({ value: ratingCount, field: 'ratingCount' }).required().isNumber().result(),
      ...new Validator({ value: status, field: 'status' }).required().enumeration([0, 1]).result(),
    ];

    if (errors.length) {
      ProductAdminValidator.throwValidationError(errors);
    }
  }

  /**
   * Create or update product details validator
   */
  public static productDetailsValidator(dto: CreateProductDetailsDTO): void {
    const {
      startAddressLine1,
      startAddressLine2,
      startCountry,
      startCity,
      startPostalCode,
      startLatitude,
      startLongitude,
      hasMobileTicket,
      hasAudioAvailable,
    } = dto;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: startAddressLine1, field: 'startAddressLine1' }).required().result(),
      ...new Validator({ value: startAddressLine2, field: 'startAddressLine2' }).required().result(),
      ...new Validator({ value: startCity, field: 'startCity' }).required().result(),
      ...new Validator({ value: startCountry, field: 'startCountry' }).required().result(),
      ...new Validator({ value: startPostalCode, field: 'startPostalCode' }).required().result(),
      ...new Validator({ value: startLatitude, field: 'startLatitude' }).required().isNumber().result(),
      ...new Validator({ value: startLongitude, field: 'startLongitude' }).required().isNumber().result(),
      ...new Validator({ value: hasMobileTicket, field: 'hasMobileTicket' }).required().isNumber().result(),
      ...new Validator({ value: hasAudioAvailable, field: 'hasAudioAvailable' })
        .required()
        .isNumber()
        .result(),
    ];

    if (errors.length) {
      ProductAdminValidator.throwValidationError(errors);
    }
  }

  /**
   * Update product meta info validator
   */
  public static updateProductMetaInfoValidator(metaInfo: Array<ProductMetaInfo>): void {
    const resultErrors = metaInfo.reduce((acc: Array<ValidatorError>, meta) => {
      const errors: Array<ValidatorError> = [
        // ...new Validator({ value: meta.key })
      ];
      return [...acc, ...errors];
    }, []);

    if (resultErrors.length) {
      ProductAdminValidator.throwValidationError(resultErrors);
    }
  }

  /**
   * Change position of image in product gallery validator
   */
  public static setGalleryPositionValidator(dto: ChangeGalleryPositionDTO): void {
    const { id, position, type } = dto;

    const errors: Array<ValidatorError> = [
      ...new Validator({ value: id, field: 'id' }).required().isNumber().result(),
      ...new Validator({ value: position, field: 'position' }).required().isNumber().result(),
      ...new Validator({ value: type, field: 'type' })
        .required()
        .enumeration<ProductMediaPositions>([ProductMediaPositions.Web, ProductMediaPositions.Mobile])
        .result(),
    ];

    if (errors.length) {
      ProductAdminValidator.throwValidationError(errors);
    }
  }
}
