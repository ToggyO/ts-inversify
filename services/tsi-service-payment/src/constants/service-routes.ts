/**
 * Description: Constants with possible routes
 */

export const SERVICE_ROUTES = {
  STRIPE: {
    ROOT: '/stripe',
    SINGLE_PAYMENT: '/single-payment',
    CUSTOMER_CREATE: '/customer/create',
    CUSTOMER_PAYMENT: '/customer/payment',
    CUSTOMER_GET_CARDS: '/customer/cards',
    CUSTOMER_GET_CARD_INFO: '/customer/card-info',
    CUSTOMER_ADD_CARD: '/customer/add-card',
    CUSTOMER_REMOVE_CARD: '/customer/remove-card/:cardId',
  },
} as const;
