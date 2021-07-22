/**
 * Description: Types for profile module
 */

import { AgeGroupOptions } from 'modules/v1/cart';

export type ChangePasswordDTO = {
  oldPassword: string;
  newPassword: string;
};

export type BookingOfUserDTO = {
  id: number;
  order_id: number;
  product_id: number;
  headout_product_id: number;
  product_name: string;
  headout_variant_id: number;
  variant_name: string;
  headout_variant_item_id: number;
  product_options: Array<AgeGroupOptions>;
  is_booked: number;
  booking_id: string;
  created_at: string;
  updated_at: string;
  inputFields_id: string;
  inputFields_level: string;
};
