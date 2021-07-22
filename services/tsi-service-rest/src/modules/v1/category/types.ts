/**
 * Description: Types for city category
 */

export type ECategory = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  status: number;
  position: number;
  slug: string;
  langCode: string;
  createdAt: Date;
  updatedAt: Date;
};
