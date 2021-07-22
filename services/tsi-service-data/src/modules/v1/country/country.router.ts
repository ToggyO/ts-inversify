/**
 * Description: Countries module router
 */

import express from 'express';
import { injectable, inject } from 'inversify';

import { BaseRouter } from 'modules/common';
import { TYPES } from 'DIContainer/types';

import { ICountryHandler } from './types';

/**
 * Router: Countries
 */
@injectable()
export class CountryRouter extends BaseRouter {
  public readonly routePrefix = '/countries';

  constructor(@inject(TYPES.ICountryHandler) protected readonly CountryController: ICountryHandler) {
    super();
  }

  public initRoutes(): express.Router {
    const { router } = this;

    /**
     * Get list of countries
     */
    router.get('/', this.asyncWrapper(this.CountryController.getCountries));

    /**
     * Geе a list of country alphabetic codes stored in the database
     */
    router.get('/alpha-codes', this.asyncWrapper(this.CountryController.getAlphaCodes));

    /**
     * Get a list of country dialing codes stored in the database
     */
    router.get('/dial-codes', this.asyncWrapper(this.CountryController.getDialCodes));

    /**
     * Get country by id
     */
    router.get('/:id', this.asyncWrapper(this.CountryController.getCountryById));

    return this.router;
  }
}
