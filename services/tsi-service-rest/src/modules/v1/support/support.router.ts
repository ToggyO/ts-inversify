/**
 * Description: Support module router
 */

import express from 'express';
import { inject, injectable } from 'inversify';

import { BaseRouter } from 'modules/common';
import { SERVICE_ENDPOINTS } from 'constants/service-endpoints';
import { TYPES } from 'DIContainer/types';

import { ISupportHandler } from './interfaces';

const { SUPPORT } = SERVICE_ENDPOINTS;

@injectable()
export class SupportRouter extends BaseRouter {
  public readonly routePrefix = SUPPORT.ROOT;

  constructor(@inject(TYPES.ISupportHandler) protected readonly supportHandler: ISupportHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Send support ticket
     * @swagger
     * path:
     *  /api-rest/support/send-ticket:
     *      post:
     *        tags:
     *          - Support
     *        description: Send support ticket
     *        summary: Send support ticket
     *        requestBody:
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/SupportTicket'
     *        responses:
     *          200:
     *            description: Successful operation
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    errorCode:
     *                      type: number
     *                      example: 0
     *                    resultData:
     *                      type: object
     */
    router.post(SUPPORT.SEND_TICKET, this.asyncWrapper(this.supportHandler.sendTicket));

    return router;
  }
}
