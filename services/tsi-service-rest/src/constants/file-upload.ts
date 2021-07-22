/**
 * Description: File upload module constants
 */

export const PROFILE_IMAGE_FIELD_NAME = 'profileImage';
export const PRODUCT_MEDIA_FIELD_NAME = 'productMedia';

export const SUPPORTED_MIME_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
} as const;

export type MimeTypes = keyof typeof SUPPORTED_MIME_TYPES;
