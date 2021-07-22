/**
 * Description: Constants with possible routes of services
 */

import { DATA_SERVICE_BASE_URL, PAYMENT_SERVICE_BASE_URL, HEADOUT_URL } from 'constants/common';

export const SERVICE_ENDPOINTS = {
  AUTH: {
    ROOT: '/auth',
    LOGIN_WITH_EMAIL: '/login-email',
    LOGIN_WITH_GOOGLE: '/login-google',
    LOGIN_WITH_FACEBOOK: '/login-facebook',
    LOGOUT: '/logout',
    REGISTRATION: '/registration',
    VERIFY_EMAIL: '/verify-email',
    VERIFY_EMAIL_WITH_AUTH: '/verify-email-with-auth',
    RESTORE_PASSWORD: '/restore-password',
    RESET_PASSWORD: '/reset-password',
    SEND_NEW_OTP: '/send-new-otp',
    CHECK_CREATION_DATA_REQUEST: '/users/check-creation-data',
    CHECK_CREDENTIALS_REQUEST: `/users/check-credentials`,
    CHECK_OTP_CODE_REQUEST: `/users/check-otp`,
    SEND_NEW_OTP_REQUEST: '/users/send-new-otp',
    FACEBOOK_GET_LONG_LIVED_ACCESS_TOKEN_URL: (graphApiVersion: string) =>
      `https://graph.facebook.com/v${graphApiVersion}/oauth/access_token`,
    FACEBOOK_GET_USER_URL: 'https://graph.facebook.com/me',
    FACEBOOK_GET_USER_PICTURE: (facebookUserId: string) =>
      `https://graph.facebook.com/v9.0/${facebookUserId}/picture`,
    RESTORE_PASSWORD_REQUEST: `/users/restore-password`,
    RESET_PASSWORD_REQUEST: '/users/reset-password',
  },
  PRODUCTS: {
    ROOT: '/products',
    TOP: '/top',
    LIVE_SEARCH: '/live-search',
    CHECK_AVAILABILITY: '/check-availability',
    GET_VARIANT_ITEMS: '/get-variant-items',
    GET_AGE_GROUPS: '/get-age-groups',
    CREATE_ORDER: '/create-order',
    PURCHASE_PRODUCT: '/purchase-product',
    GET_BY_NAME: '/slug/:slug',
    GET_AVAILABLE_DATES: '/get-variants/:variantId/available-dates',
    GET_PRODUCTS: (queries: string) => `/products${queries}`,
    LIVE_SEARCH_REQUEST: (queries: string) => `/products/live-search${queries}`,
    GET_PRODUCT_DETAILS_BY_SLUG: (slug: string, queries: string) => `/products/slug/${slug}${queries}`,
    UPDATE_TOP: (id: number) => `/products/top/${id}`,
    CHECK_AVAILABILITY_REQUEST: (variantId: number, variantItemId: number) =>
      `/products/get-variants/${variantId}/${variantItemId}`,
    GET_AVAILABLE_DATES_REQUEST: (variantId: number) => `/products/get-variants/${variantId}/available-dates`,
    GET_VARIANT_ITEMS_REQUEST: '/products/get-variant-items',
    GET_VARIANT_ITEM_META_INFO: '/products/get-variant-item-meta',
  },
  CITIES: {
    ROOT: '/cities',
    TOP: '/top',
    GET_CITIES: (queries: string) => `/cities${queries}`,
    GET_CITY_BY_ID: (id: number, queries: string) => `/cities/${id}${queries}`,
    UPDATE_TOP: (id: number) => `/cities/top/${id}`,
  },
  USERS: {
    ROOT: '/users',
    FAVOURITE_PRODUCTS: '/:id/favourites',
    GET_USERS: (queries: string) => `/users${queries}`,
    GET_USER_BY_ID: (id: number) => `/users/${id}`,
    UPDATE_USER_REQUEST: (id: number) => `/users/${id}`,
    UPDATE_CUSTOMER_TOKEN_REQUEST: (id: number) => `/users/${id}/customer_token`,
    CREATE_USER: `/users/create`,
    DELETE_BY_ID: (id: number) => `/users/${id}`,
    PATCH_FAVOURITE_PRODUCTS: (id: number, queries: string) => `/users/${id}/favourites${queries}`,
  },
  COUNTRY: {
    ROOT: '/countries',
    ALPHA_CODES: '/alpha-codes',
    DIAL_CODES: '/dial-codes',
    GET_COUNTRIES: (queries: string) => `/countries${queries}`,
    GET_COUNTRY_BY_ID: (id: number, queries: string) => `/countries/${id}${queries}`,
    GET_ALPHA_CODES: `/countries/alpha-codes`,
    GET_DIAL_CODES: `/countries/dial-codes`,
  },
  PROFILE: {
    ROOT: '/profile',
    CHANGE_PASSWORD: '/change-password',
    PROFILE_IMAGE: '/image',
    FAVOURITES: '/favourites',
    GET_BOOKINGS: '/bookings',
    CHANGE_PASSWORD_REQUEST: '/users/change-password',
    PROFILE_IMAGE_REQUEST: (id: number) => `/users/${id}/profile-image`,
    GET_FAVOURITES_REQUEST: (userId: number, queries: string) => `/users/${userId}/favourites${queries}`,
    GET_BOOKINGS_REQUEST: (id: number, queries: string) => `/orders/by-user/${id}${queries}`,
  },
  HEADOUT: {
    GET_VARIANTS: (
      variantId: number,
      startDateTime: string,
      endDateTime: string,
      { limit, offset }: { limit?: number; offset?: number },
    ) =>
      `/inventory/list-by/variant?variantId=${variantId}&startDateTime=${startDateTime}&endDateTime=${endDateTime}${
        limit ? `&limit=${limit}` : ''
      }${offset ? `&limit=${offset}` : ''}`,
    GET_BOOKING_BY_ID: (bookingId: string) => `/booking/${bookingId}`,
    CREATE_BOOKING: '/booking',
    MODIFY_BOOKING: (bookingId: number) => `/booking/${bookingId}`,
  },
  SHOPPING_CART: {
    ROOT: '/cart',
    ITINERARY_REQUEST: `/itinerary`,
    ITINERARY_ITEM_REQUEST: '/itinerary/itinerary-item',
    REMOVE_ITINERARY_ITEM_REQUEST: (itineraryItemId: number) =>
      `/itinerary/itinerary-item/${itineraryItemId}`,
    ITINERARY_BOOK_REQUEST: '/itinerary/book',
  },
  PAYMENT: {
    ROOT: '/payment',
    STRIPE: {
      SINGLE_PAYMENT: '/stripe/single-payment',
      CUSTOMER_CREATE: '/stripe/customer/create',
      CUSTOMER_PAYMENT: '/stripe/customer/payment',
      CUSTOMER_GET_CARDS: '/stripe/customer/cards',
      CUSTOMER_GET_CARD_INFO: '/stripe/customer/card-info',
      CUSTOMER_ADD_CARD: '/stripe/customer/add-card',
      CUSTOMER_REMOVE_CARD: '/stripe/customer/remove-card/:cardId',
      CUSTOMER_REMOVE_CARD_REQUEST: (cardId: string) => `/stripe/customer/remove-card/${cardId}`,
    },
  },
  ORDERS: {
    MANAGE_ORDER_REQUEST: '/orders',
    GET_ORDER_BY_ID_REQUEST: (orderId: number) => `/orders/${orderId}`,
    CREATE_ORDER_PAYMENT: '/orders/payments',
    GET_ORDER_PAYMENT_BY_ID: (id: number) => `/orders/payments/${id}`,
    GET_TICKETS_REQUEST: (orderId: number) => `/orders/${orderId}/tickets`,
    // BOOK_ITINERARY_ITEMS: ()
  },
  CATEGORIES: {
    ROOT: '/categories',
    GET_E_CATEGORIES: '/e-categories',
    GET_E_CATEGORIES_REQUEST: (queries: string) => `/categories/e-categories${queries}`,
  },
  SUPPORT: {
    ROOT: '/support',
    SEND_TICKET: '/send-ticket',
  },

  ADMIN: {
    ROOT: '/admin',
    AUTH: {
      ROOT: '/auth',
      LOGIN: '/login',
      LOGOUT: '/logout',
      RESTORE_PASSWORD: '/restore-password',
      RESET_PASSWORD: '/reset-password',
      CHECK_CREDENTIALS_REQUEST: '/admin/admin-user/check-credentials',
      RESTORE_PASSWORD_REQUEST: '/admin/admin-user/restore-password',
      RESET_PASSWORD_REQUEST: '/admin/admin-user/reset-password',
    },
    PROFILE: {
      ROOT: '/profile',
      CHANGE_PASSWORD: '/change-password',
      PROFILE_IMAGE: '/image',
      PROFILE_REQUEST: (id: number) => `/admin/admin-user/${id}`,
      CHANGE_PASSWORD_REQUEST: '/admin/admin-user/change-password',
      PROFILE_IMAGE_REQUEST: (id: number) => `/admin/admin-user/${id}/profile-image`,
    },
    PRODUCTS: {
      ROOT: '/products',
      GET_PRODUCT_DETAILS_BY_ID: (id: number, queries: string) => `/products/${id}${queries}`,
      CREATE_REQUEST: '/admin/products',
      UPDATE: '/update/:productId',
      UPDATE_REQUEST: (productId: number, queries: string) => `/admin/products/${productId}${queries}`,
      UPDATE_DETAILS: '/update/:productId/details',
      UPDATE_DETAILS_REQUEST: (productId: number, queries: string) =>
        `/admin/products/${productId}/details${queries}`,
      UPDATE_META_INFO: '/update/:productId/meta-info',
      UPDATE_META_INFO_REQUEST: (productId: number, queries: string) =>
        `/admin/products/${productId}/meta-info${queries}`,
      TOGGLE_BLOCK: '/update/:productId/toggle-block',
      TOGGLE_BLOCK_REQUEST: (productId: number, queries: string) =>
        `/admin/products/${productId}/toggle-block${queries}`,
      ATTACH_MEDIA: '/:productId/attach-media',
      ATTACH_MEDIA_REQUEST: (productId: number, queries: string) =>
        `/admin/products/${productId}/attach-media${queries}`,
      GALLERY_POSITION: '/:productId/gallery-position',
      GALLERY_POSITION_REQUEST: (productId: number, queries: string) =>
        `/admin/products/${productId}/gallery-position${queries}`,
      REMOVE_ASSET: '/:productId/remove-media',
      REMOVE_ASSET_REQUEST: (productId: number, queries: string) =>
        `/admin/products/${productId}/remove-media${queries}`,
    },
    USERS: {
      ROOT: '/users',
      GET_USERS: (queries: string) => `/users${queries}`,
      GET_USER_BY_ID: (id: number) => `/users/${id}`,
      CREATE_REQUEST: (query: string) => `/admin/users${query}`,
      CHANGE_EMAIL: '/:userId/change-email',
      CHANGE_EMAIL_REQUEST: (query: string) => `/admin/users/change-email${query}`,
      TOGGLE_BLOCK: '/:userId/toggle-block',
      TOGGLE_BLOCK_REQUEST: (userId: number, queries: string) =>
        `/admin/users/${userId}/toggle-block${queries}`,
    },
    PROMO: {
      ROOT: '/admin/promo-codes',
      PROMO_CODES_LIST_REQUEST: (query: string) => `/admin/promo-codes${query}`,
      TOGGLE_ACTIVITY: '/:promoCodeId/toggle-activity',
      TOGGLE_ACTIVITY_REQUEST: (promoCodeId: number) => `/admin/promo-codes/${promoCodeId}/toggle-activity`,
      REMOVE_PROMO_REQUEST: (promoCodeId: number) => `/admin/promo-codes/${promoCodeId}`,
    },
  },
  getDataServiceUrl(route: string) {
    return `${DATA_SERVICE_BASE_URL}${route}`;
  },
  getPaymentServiceUrl(route: string) {
    return `${PAYMENT_SERVICE_BASE_URL}${route}`;
  },
  getHeadoutUrl(route: string) {
    return `${HEADOUT_URL}${route}`;
  },
} as const;
