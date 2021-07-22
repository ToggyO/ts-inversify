/**
 * Success response global constructor
 */

type GetSuccessRes<T> = {
  errorCode: string | number;
  resultData: T | null;
};

type ResultData<T> = { resultData: T | undefined | null };

export const getSuccessRes = <T>({ resultData = null }: ResultData<T>): GetSuccessRes<T> => ({
  errorCode: 0,
  resultData,
});
