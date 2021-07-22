/**
 * Description: Headout customer DTO
 */

import { Customers, HeadoutPersonType, InputFields } from 'utils/headout';

export class HeadoutCustomersDTO {
  public personType: HeadoutPersonType;
  public isPrimary: boolean;
  public inputFields: Array<InputFields>;

  constructor(payload: Customers) {
    this.personType = payload.personType;
    this.isPrimary = payload.isPrimary;
    this.inputFields = payload.inputFields;
  }
}
