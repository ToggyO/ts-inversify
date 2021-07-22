/**
 * Description: Shopping cart module controller for handling shopping cart routing
 */

import { Request, Response, NextFunction } from 'express';
import { AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';

import { ExtendedSession } from 'declaration';
import { TYPES } from 'DIContainer/types';
import { BaseController } from 'modules/common';
import { getSuccessRes, Success } from 'utils/response';
import { autobind, getProp } from 'utils/helpers';
import { IIdentityHelpers } from 'utils/authentication';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';

import { CartItemDTO, AddToCartDTO, Cart, UpdateCartItemDTO } from './types';
import { ICartHandler } from './interfaces';

const { SHOPPING_CART, getDataServiceUrl } = SERVICE_ENDPOINTS;

@injectable()
export class CartController extends BaseController implements ICartHandler {
  constructor(@inject(TYPES.IIdentityHelpers) protected readonly _identityHelpers: IIdentityHelpers) {
    super();
    autobind(this);
  }

  /**
   * Get shopping cart of current authenticated user or guest
   */
  public async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = getProp<ExtendedSession>(req, 'session', undefined);
      const customerIds = await this._identityHelpers.getCustomerIds(session);

      const response: AxiosResponse<Success<Cart>> = await this.axios.post(
        getDataServiceUrl(SHOPPING_CART.ITINERARY_REQUEST),
        customerIds,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { resultData } = response.data;

      res.status(200).send(
        getSuccessRes<Cart>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create shopping cart or update existed cart by adding new item
   */
  public async addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<AddToCartDTO>(req, 'body', {});
      const session = getProp<ExtendedSession>(req, 'session', undefined);
      const customerIds = await this._identityHelpers.getCustomerIds(session);

      const response: AxiosResponse<Success<CartItemDTO>> = await this.axios.post(
        getDataServiceUrl(SHOPPING_CART.ITINERARY_ITEM_REQUEST),
        { ...body, ...customerIds },
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { resultData } = response.data;

      res.status(200).send(
        getSuccessRes<CartItemDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update cart item associated with cart by id
   */
  public async updateCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<UpdateCartItemDTO>(req, 'body', {});
      const session = getProp<ExtendedSession>(req, 'session', undefined);
      const customerIds = await this._identityHelpers.getCustomerIds(session);

      const response: AxiosResponse<Success<Cart>> = await this.axios.patch(
        getDataServiceUrl(SHOPPING_CART.ITINERARY_REQUEST),
        { ...body, ...customerIds },
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { resultData } = response.data;

      res.status(200).send(
        getSuccessRes<Cart>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove item from shopping cart
   */
  public async removeItemFromCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const itineraryItemId = getProp<number>(req, 'params.itineraryItemId', null);
      const session = getProp<ExtendedSession>(req, 'session', undefined);
      const customerIds = await this._identityHelpers.getCustomerIds(session);

      const response: AxiosResponse<Success<number>> = await this.axios.patch(
        getDataServiceUrl(SHOPPING_CART.REMOVE_ITINERARY_ITEM_REQUEST(itineraryItemId)),
        customerIds,
      );

      if (response.status !== 200) {
        this.throwNonSuccessResponseError(response);
      }

      const { resultData } = response.data;

      res.status(200).send(
        getSuccessRes<number>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }
}
