/**
 * Description: Types and interfaces for Leopold helpers class
 */

import { LeopoldFilterOperations } from './enums';

export type LeopoldSorter = [string[], 'ACS' | 'DESC'];

export type ParsedLeopoldFilter = {
  field: string;
  operation: LeopoldFilterOperations;
  stringValue: string;
};
