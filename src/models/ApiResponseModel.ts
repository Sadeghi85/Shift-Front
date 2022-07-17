export interface IApiResponseModel<T> {
  success: boolean;
  failureMessage: string;
  totalCount: number;
  data: T[];
}
