/**
 * Description: Itinerary(Shopping cart) module controller for handling itinerary routing
 */

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { BaseController } from 'modules/common';
import { ApplicationError, getSuccessRes } from 'utils/response';
import { getProp, autobind } from 'utils/helpers';
import { TYPES } from 'DIContainer/types';

import { ItineraryModel } from './itinerary.model';
import {
  ItineraryItemDTO,
  ManageItineraryDTO,
  IItineraryHandler,
  IItineraryEntityService,
  GetItineraryWithItemsDTO,
  UpdateItemOfItineraryDTO,
} from './types';
import { ITINERARY_ERROR_MESSAGES } from './constants';

@injectable()
export class ItineraryController extends BaseController implements IItineraryHandler {
  constructor(
    @inject(TYPES.IItineraryEntityService) protected readonly ItineraryService: IItineraryEntityService,
  ) {
    super();
    autobind(this);
  }

  /**
   * Get shopping cart of current authenticated user or guest
   */
  public async getItineraryWithItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<GetItineraryWithItemsDTO>(req, 'body', {});

      const resultData = await this.ItineraryService.getItineraryWithItems(body);

      res.status(200).send(
        getSuccessRes<ItineraryModel | null>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create itinerary or update existed by adding new item
   */
  public async manageItinerary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = getProp<ManageItineraryDTO>(req, 'body', {});

      const resultData = await this.ItineraryService.manageItinerary(dto);

      res.status(200).send(
        getSuccessRes<ItineraryItemDTO>({ resultData }),
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update itinerary item associated with itinerary by id
   */
  public async updateItinerary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<UpdateItemOfItineraryDTO>(req, 'body', {});

      const updateResult = await this.ItineraryService.updateItinerary(body);

      if (!updateResult) {
        this.notFoundErrorPayload(ITINERARY_ERROR_MESSAGES.NOT_FOUND);
      }

      const resultData = await this.ItineraryService.getItineraryWithItems(body);

      res.status(200).send(getSuccessRes({ resultData }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove itinerary with items
   */
  public async removeItineraryItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const itineraryItemId = getProp<number>(req, 'params.itineraryItemId', null);
      const body = getProp<GetItineraryWithItemsDTO>(req, 'body', {});

      const deletedRowsCount = await this.ItineraryService.removeItineraryItem({ ...body, itineraryItemId });

      if (deletedRowsCount === 0) {
        throw new ApplicationError(this.notFoundErrorPayload(ITINERARY_ERROR_MESSAGES.NOT_FOUND));
      }

      res.status(200).send(getSuccessRes({ resultData: null }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set itinerary items booked
   */
  public async bookItineraryItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = getProp<GetItineraryWithItemsDTO>(req, 'body', {});

      await this.ItineraryService.bookItineraryItems(body);

      res.status(200).send(getSuccessRes({ resultData: null }));
    } catch (error) {
      next(error);
    }
  }
}
