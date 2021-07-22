/**
 * Description: Product module enums
 */

export enum ProductIncludeLiterals {
  ProductDetails = 'productDetails',
  ProductMedia = 'productMedia',
  ProductMetaInfos = 'productMetaInfos',
  ProductRatings = 'productRatings',
  ProductViews = 'productViews',
  VariantsOfProducts = 'variantsOfProducts',
}

export enum ProductArticleTypes {
  Place = 'Place',
  Event = 'Event',
}

export enum ProductMediaPositions {
  Web = 'web',
  Mobile = 'mobile',
}

export enum HeadoutPersons {
  Infant = 'Infant',
  Child = 'Child',
  Student = 'Student',
  Adult = 'Adult',
  Senior = 'Senior',
  Family = 'Family',
}

export enum VariantInventoryType {
  FixedStartFixedDuration = 'FIXED_START_FIXED_DURATION',
  FlexibleStartFlexibleDuration = 'FLEXIBLE_START_FLEXIBLE_DURATION',
  FixedStartFlexibleDuration = 'FIXED_START_FLEXIBLE_DURATION',
  FlexibleStartFixedDuration = 'FLEXIBLE_START_FIXED_DURATION',
}
