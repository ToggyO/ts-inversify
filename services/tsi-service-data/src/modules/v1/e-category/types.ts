/**
 * Description: Types for category entity
 */

import { ECategoryModel } from './e-category.model';

export type ECategoryModelType = typeof ECategoryModel;

export type CreateECategoryDTO = {
  name: string;
  description: string;
  imageUrl: string;
  status: number;
  position: number;
  slug: string;
  langCode: string;
  metaKeyword?: string;
  metaDescription?: string;
};

export type UpdateECategoryDTO = {
  name: string;
  description: string;
  imageUrl: string;
  status: number;
  position: number;
  slug: string;
  langCode: string;
  metaKeyword?: string;
  metaDescription?: string;
};

export type CreateECategoryProductDTO = {
  eCategoryId: number;
  productId: number;
};
