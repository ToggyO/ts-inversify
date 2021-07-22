/**
 * Description: User module constants
 */

export const ITINERARY_ERROR_MESSAGES = {
  NOT_FOUND: "Itinearary with this identifier doesn't exist",
  IS_EXISTS: 'Already in cart',
  NO_VISITOR_ID: 'Must provide a valid user id or guest id',
  ATTENDANT_REQUIRED: 'For age groups `Infant`, `Child` an attendant is required.',
} as const;
