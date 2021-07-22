/**
 * Description: Types and interfaces for favourite product entity
 */

import { FavouriteProductModel } from './favourite-product.model';

export type FavouriteProductModelType = typeof FavouriteProductModel;

export type FavouriteProduct = {
  id: number;
  deviceType: number;
  tokenId: string;
  userId: number;
  productId: number;
  utmSource: string;
  utmMedium: string;
  createdAt: Date;
  updatedAt: Date;
};
