/**
 * Description: Types for product entity
 */

import { ProductModel } from './product.model';
import { ProductArticleTypes, ProductMediaPositions, VariantInventoryType } from './product.enums';
import { VariantModel } from '../variant/variant.model';
import { VariantItemModel } from '../variant-item/variant-item.model';
import { ItemMetaInfoModel } from '../item-meta-info/item-meta-info.model';

export type ProductModelType = typeof ProductModel;

export type VariantModelType = typeof VariantModel;

export type VariantItemModelType = typeof VariantItemModel;

export type ItemMetaInfoModelType = typeof ItemMetaInfoModel;

export type CreateProductDTO = {
  name: string;
  articleType: ProductArticleTypes;
  categoryIds: Array<number>;
  ratingAvg: number;
  ratingCount: number;
  status: number;
  sourceId: number;
  metaKeyword?: string;
  metaDescription?: string;
};

export type CreateProductDetailsDTO = {
  productId: number;
  startAddressLine1: string;
  startAddressLine2: string;
  startCity: string;
  startCountry: string;
  startPostalCode: string;
  startLatitude: string;
  startLongitude: string;
  hasMobileTicket: number;
  hasAudioAvailable: number;
};

export type Product = {
  id: number;
  productId: number;
  name: string;
  articleType: string;
  url: string;
  imageUrl: string;
  neighborhood: string;
  canonicalUrl: string;
  ratingAvg: number;
  ratingCount: number;
  pricingType: string;
  originalPrice: number;
  finalPrice: number;
  bestDiscount: number;
  metaTitle: string;
  metaAuthor: string;
  metaKeyword: string;
  metaDescription: string;
  slug: string;
  langCode: string;
  isSuggested: number;
  status: number;
  sourceId: number;
  currency: string;
  cityId: number;
  isFavourite?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateProductTopRequest = {
  topActivities: boolean;
  mostPopular: boolean;
};

export type UpdateProductTopDTO = {
  topActivities: boolean;
  mostPopular: boolean;
};

export type GetVariantWithVariantItemDTO = {
  variantId: number;
  variantItemId: number;
};

export type VariantsDTO = {
  headoutVariantId: number;
  variantName: string;
  startDateTime: Date | undefined;
  endDateTime: Date | undefined;
};

export type GetVariantItemsDTO = {
  productId: number;
  date: string; // dd/mm/yyyy
  variantId: number;
  sourceId: number;
};

export type FindVariantItemsDTO = {
  variantId: number;
  startDate: string;
  endOfTheStartDay: string;
};

export type GetVariantMetaInfoDTO = {
  productId: number;
  date: string; // dd/mm/yyyy
  variantId: number;
  variantItemId: number;
  sourceId: number;
};

export type HeadoutPersonType = 'ADULT' | 'CHILD' | 'INFANT' | 'SENIOR' | 'FAMILY' | 'STUDENT';
export type HeadoutPersonTypeName = 'Adult' | 'Child' | 'Infant' | 'Senior' | 'Family' | 'Student';

export type AgeGroup = {
  type: HeadoutPersonType;
  name: HeadoutPersonTypeName;
  ageFrom: number;
  ageTo: number;
  price: number;
  originalPrice: number;
};

export type ProductMetaInfo = {
  id: number;
  productId: number;
  metaKey: string;
  metaKeyHtml: string;
  metaValue: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductMetaInfoDTO = Omit<ProductMetaInfo, 'id' & 'createdAt' & 'updatedAt'>;

export type ProductMedia = {
  id: number;
  productId: number;
  imageUrl: string;
  caption: string;
  webPosition: number;
  mobilePosition: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductMediaDTO = Omit<ProductMedia, 'id' & 'createdAt' & 'updatedAt'>;

export type ChangeGalleryPositionDTO = {
  id: number;
  position: number;
  type: ProductMediaPositions;
};

export type ManualData = {
  productId: number;
  maxPerson: number;
  inventoryType: VariantInventoryType;
  duration: number;
  startDate: string;
  endDate: string;
  Monday: Array<string>;
  Tuesday: Array<string>;
  Wednesday: Array<string>;
  Thursday: Array<string>;
  Friday: Array<string>;
  Saturday: Array<string>;
  Sunday: Array<string>;
  ticketType: {
    infant: 'Infant';
    child: 'Child';
    youth: 'Youth';
    adult: 'Adult';
  };
  ticketFrom: {
    infant: number | null;
    child: number | null;
    youth: number | null;
    adult: number | null;
  };
  ticketTo: {
    infant: number | null;
    child: number | null;
    youth: number | null;
    adult: number | null;
  };
  ticketPrice: {
    infant: number | null;
    child: number | null;
    youth: number | null;
    adult: number | null;
  };
  ticketOriginalPrice: {
    infant: number | null;
    child: number | null;
    youth: number | null;
    adult: number | null;
  };
};

export type CreateVariantManualDataDTO = {
  productId: number;
  data: ManualData;
};

export type VariantManualData = CreateVariantManualDataDTO & { id: number };
