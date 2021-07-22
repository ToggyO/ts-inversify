/**
 * Description: Queue module constants
 */

export const NO_QUEUE_FOUND = (name: string): string => `No queue was found with the given name (${name}).`;

export const DUPLICATE_QUEUE = (name: string): string =>
  `Queue with the given name (${name}) already exists. Ignored.`;

export const SUCCESSFUL_QUEUE_REGISTRATION = (name: string): string =>
  `Connection to (${name}) queue successfully established`;

export const QUEUE_ERROR = (name: string, error: unknown): string =>
  `Connection to (${name}) queue ended with an error: ${error}`;
