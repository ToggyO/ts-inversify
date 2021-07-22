/**
 * Описание: Файл содержит функция получения базового URL микросериса
 */

import { NODE_ENV, TSI_REST_HOST, TSI_REST_PORT, API_DOMAIN } from 'constants/env';

export const getAppBaseUrl = (): string =>
  NODE_ENV === 'development' ? `http://${TSI_REST_HOST}:${TSI_REST_PORT}` : `${API_DOMAIN}`;

export const getServerDescription = (): string => {
  if (NODE_ENV === 'production') {
    return 'Production';
  }

  if (NODE_ENV === 'staging') {
    return 'Staging';
  }

  return 'Local';
};
