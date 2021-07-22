/**
 * Description: Headout API module enums
 */

export enum BookingStatuses {
  Uncaptured = 'UNCAPTURED',
  Pending = 'PENDING',
  CaptureTimeout = 'CAPTURE_TIMEOUT',
  Canceled = 'CANCELLED',
  Completed = 'COMPLETED',
  Dirty = 'DIRTY',
}
