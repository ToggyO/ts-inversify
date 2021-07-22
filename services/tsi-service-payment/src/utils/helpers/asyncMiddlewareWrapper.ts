/**
 * Description: Function-wrapper for async express middleware
 */

export type IAsyncWrapper<T = any> = (fn: T) => (...args: any[]) => Promise<any>;

/**
 * Wrapper for express middleware
 * It gives possibility to catch errors
 * in body of async middleware. This errors will be catched by the global error handler
 */
export const asyncWrapper: IAsyncWrapper = <T extends (...args: any[]) => Promise<any>>(fn: T) => (
  ...args: any[]
) => {
  const fnReturn = fn(...args);
  const next = args[args.length - 1];
  return Promise.resolve(fnReturn).catch(next);
};
