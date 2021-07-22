/**
 * Description: Class for combining entity models into a single database context
 */

import { Application } from 'express';
import { inject, injectable } from 'inversify';

import { IDbContext } from 'db/interfaces';
import { isConstructor } from 'utils/helpers';
import { TYPES } from 'DIContainer/types';
import { ILogger } from 'utils/logger';

import { UserModel } from 'modules/v1/user';
import { CountryModel } from 'modules/v1/country';
import { RegistrationOtpModel } from 'modules/v1/registration-otp/registration-otp.model';
import { ProductModel } from 'modules/v1/product';
import { ProductDetailModel } from 'modules/v1/product-detail/product-detail.model';
import { ProductMediaModel } from 'modules/v1/product-media/product-media.model';
import { ProductMetaInfoModel } from 'modules/v1/product-meta-info/product-meta-info.model';
import { ProductRatingModel } from 'modules/v1/product-rating/product-rating.model';
import { ProductRatingCommentModel } from 'modules/v1/product-rating-comment/product-rating-comment.model';
import { ProductViewModel } from 'modules/v1/product-view/product-views.model';
import { CityModel } from 'modules/v1/city';
import { FavouriteProductModel } from 'modules/v1/favourite-product/favourite-product.model';
import { SourceModel } from 'modules/v1/source/source.model';
import { VariantModel } from 'modules/v1/variant/variant.model';
import { VariantItemModel } from 'modules/v1/variant-item/variant-item.model';
import { ItemMetaInfoModel } from 'modules/v1/item-meta-info/item-meta-info.model';
import { SalesFlatOrderModel } from 'modules/v1/sales-flat-order';
import { SalesFlatOrderPaymentModel } from 'modules/v1/sales-flat-order-payment/sales-flat-order-payment.model';
import { ItineraryModel } from 'modules/v1/itinerary/itinerary.model';
import { ItineraryItemModel } from 'modules/v1/itinerary-item/itinerary-item.model';
import { PasswordResetModel } from 'modules/v1/password-reset/password-reset.model';
import { ECategoryModel } from 'modules/v1/e-category/e-category.model';
import { ECategoryProductModel } from 'modules/v1/e-category-product/e-category-product.model';
import { SalesFlatOrderItemModel } from 'modules/v1/sales-flat-order-item/sales-flat-order-item.model';
import { SalesFlatOrderItemsMetaModel } from 'modules/v1/sales-flat-order-items-meta';
import { VariantManualDataModel } from 'modules/v1/variant-manual-data/variant-manual-data.model';
import { PromoCodeModel } from 'modules/v1/promo-code/promo-code.model';
import { PromoCodeUseModel } from 'modules/v1/promo-code/promo-code-use.model';
import { AdminModel } from 'modules/v1/admin/admin-user/models/admin.model';
import { AdminPasswordResetModel } from 'modules/v1/admin/admin-user/models/admin-password-reset.model';

export interface IDbModels {
  UserModel: typeof UserModel;
  CountryModel: typeof CountryModel;
  RegistrationOtpModel: typeof RegistrationOtpModel;
  ProductModel: typeof ProductModel;
  ProductDetailModel: typeof ProductDetailModel;
  ProductMediaModel: typeof ProductMediaModel;
  ProductMetaInfoModel: typeof ProductMetaInfoModel;
  ProductRatingModel: typeof ProductRatingModel;
  ProductRatingCommentModel: typeof ProductRatingCommentModel;
  ProductViewModel: typeof ProductViewModel;
  CityModel: typeof CityModel;
  FavouriteProductModel: typeof FavouriteProductModel;
  SourceModel: typeof SourceModel;
  VariantModel: typeof VariantModel;
  VariantItemModel: typeof VariantItemModel;
  ItemMetaInfoModel: typeof ItemMetaInfoModel;
  SalesFlatOrderModel: typeof SalesFlatOrderModel;
  SalesFlatOrderPaymentModel: typeof SalesFlatOrderPaymentModel;
  ItineraryModel: typeof ItineraryModel;
  ItineraryItemModel: typeof ItineraryItemModel;
  PasswordResetModel: typeof PasswordResetModel;
  ECategoryModel: typeof ECategoryModel;
  ECategoryProductModel: typeof ECategoryProductModel;
  SalesFlatOrderItemModel: typeof SalesFlatOrderItemModel;
  SalesFlatOrderItemsMetaModel: typeof SalesFlatOrderItemsMetaModel;
  VariantManualDataModel: typeof VariantManualDataModel;
  PromoCodeModel: typeof PromoCodeModel;
  PromoCodeUseModel: typeof PromoCodeUseModel;
  AdminModel: typeof AdminModel;
  AdminPasswordResetModel: typeof AdminPasswordResetModel;
}

@injectable()
export class DbModels implements IDbModels {
  public UserModel = UserModel;
  public CountryModel = CountryModel;
  public RegistrationOtpModel = RegistrationOtpModel;
  public ProductModel = ProductModel;
  public ProductDetailModel = ProductDetailModel;
  public ProductMediaModel = ProductMediaModel;
  public ProductMetaInfoModel = ProductMetaInfoModel;
  public ProductRatingModel = ProductRatingModel;
  public ProductRatingCommentModel = ProductRatingCommentModel;
  public ProductViewModel = ProductViewModel;
  public CityModel = CityModel;
  public FavouriteProductModel = FavouriteProductModel;
  public SourceModel = SourceModel;
  public VariantModel = VariantModel;
  public VariantItemModel = VariantItemModel;
  public ItemMetaInfoModel = ItemMetaInfoModel;
  public SalesFlatOrderModel = SalesFlatOrderModel;
  public SalesFlatOrderPaymentModel = SalesFlatOrderPaymentModel;
  public ItineraryModel = ItineraryModel;
  public ItineraryItemModel = ItineraryItemModel;
  public PasswordResetModel = PasswordResetModel;
  public ECategoryModel = ECategoryModel;
  public ECategoryProductModel = ECategoryProductModel;
  public SalesFlatOrderItemModel = SalesFlatOrderItemModel;
  public SalesFlatOrderItemsMetaModel = SalesFlatOrderItemsMetaModel;
  public VariantManualDataModel = VariantManualDataModel;
  public PromoCodeModel = PromoCodeModel;
  public PromoCodeUseModel = PromoCodeUseModel;
  public AdminModel = AdminModel;
  public AdminPasswordResetModel = AdminPasswordResetModel;
}

@injectable()
export class DbContext extends DbModels implements IDbContext {
  constructor(@inject(TYPES.ILogger) private readonly _logger: ILogger) {
    super();
  }

  public initializeModels(app: Application): void {
    for (const modelKey in this) {
      if (isConstructor(modelKey) || typeof this[modelKey] !== 'function') {
        continue;
      }
      try {
        this[modelKey as keyof DbModels].prepareInit(app);
      } catch (error) {
        console.log(modelKey);
        this._logger.error(error.message);
      }
    }

    for (const modelKey in this) {
      // Callback of the model on a ready event of all available models
      if (isConstructor(modelKey) || typeof this[modelKey] !== 'function') {
        continue;
      }
      try {
        this[modelKey as keyof DbModels].onAllModelsInitialized(this);
      } catch (error) {
        this._logger.error(error.message);
      }
    }
  }
}
