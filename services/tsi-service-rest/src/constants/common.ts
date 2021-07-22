/**
 * Description: Common application constants
 */

import {
  NODE_ENV,
  TSI_DATA_DOCKER_HOST,
  TSI_DATA_HOST,
  TSI_DATA_PORT,
  TSI_PAYMENT_DOCKER_HOST,
  TSI_PAYMENT_HOST,
  TSI_PAYMENT_PORT,
  HEADOUT_CURRENT_URL,
  ROUTE_PREFIX,
  TSI_REST_API_VERSION,
} from './env';

export const API_URL_PREFIX = `${ROUTE_PREFIX}/swagger/v${TSI_REST_API_VERSION || 1}`;

export const DATA_SERVICE_BASE_URL = `http://${
  NODE_ENV !== 'development' ? TSI_DATA_DOCKER_HOST : TSI_DATA_HOST
}:${TSI_DATA_PORT}`;

export const PAYMENT_SERVICE_BASE_URL = `http://${
  NODE_ENV !== 'development' ? TSI_PAYMENT_DOCKER_HOST : TSI_PAYMENT_HOST
}:${TSI_PAYMENT_PORT}`;

export const HEADOUT_URL = HEADOUT_CURRENT_URL;

export const MICROSERVICES_AUTH_HEADER = 'With-User-Payload';
