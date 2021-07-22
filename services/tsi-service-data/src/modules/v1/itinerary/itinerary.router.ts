/**
 * Description: Itinerary(Shopping cart) module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from '../../common';
import { TYPES } from 'DIContainer/types';

import { IItineraryHandler } from './types';

/**
 * Router: Itinerary
 */
@injectable()
export class ItineraryRouter extends BaseRouter {
  public readonly routePrefix = '/itinerary';

  constructor(@inject(TYPES.IItineraryHandler) protected readonly ItineraryController: IItineraryHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get shopping cart of current authenticated user or guest
     */
    router.post('/', this.asyncWrapper(this.ItineraryController.getItineraryWithItems));

    /**
     * Create shoping cart or update existed cart by adding new item
     */
    router.post('/itinerary-item', this.asyncWrapper(this.ItineraryController.manageItinerary));

    /**
     * Update itinerary item assosiated with itinerary by id
     */
    router.patch('/', this.asyncWrapper(this.ItineraryController.updateItinerary));

    /**
     * Remove itinerary item from shoping cart
     */
    router.patch(
      '/itinerary-item/:itineraryItemId',
      this.asyncWrapper(this.ItineraryController.removeItineraryItem),
    );

    /**
     * Set itinerary items booked
     */
    router.post('/book', this.asyncWrapper(this.ItineraryController.bookItineraryItems));

    return this.router;
  }
}
