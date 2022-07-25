export interface IApiResponseModel<T> {
  success: boolean;
  failureMessage: string | null;
  totalCount: number;
  data: T[];
}
