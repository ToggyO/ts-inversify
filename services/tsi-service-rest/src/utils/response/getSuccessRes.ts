/**
 * Success response global constructor
 */

export type ResultData<T> = { resultData: T | undefined | null };

export type GetSuccessRes<T> = {
  errorCode: string | number;
  resultData: T | null;
};

export const getSuccessRes = <T>({ resultData = null }: ResultData<T>): GetSuccessRes<T> => ({
  errorCode: 0,
  resultData,
});

export class Response {
  public errorCode: number;
}

export class Success<T> extends Response {
  public resultData: T;
}
