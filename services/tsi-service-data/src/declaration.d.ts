/**
 * Description: Extended express Request interface declaration
 */

export declare type NoInferType<T> = [T][T extends any ? 0 : never];

export declare type FunctionType = (...args: Array<any>) => any;
