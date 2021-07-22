/**
 * Description: Types for sales flat order items meta module
 */

export type CreateOrderItemDTO = {
  orderId: number;
  productId: number;
  headoutProductId: number;
  productName: string;
  headoutVariantId: number;
  variantName: string;
  headoutVariantItemId: number;
  productOptions: string;
  isBooked: number;
  bookingId: string | null;
  inputFieldsId: string;
  inputFieldsLevel: string;
  date: Date;
  time: string;
};

export type UpdateOrderItemDTO = Partial<CreateOrderItemDTO>;
