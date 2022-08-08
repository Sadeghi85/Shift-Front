export interface IApiResponseModel<T> {
  success: boolean;
  message: string | null;
  totalCount: number;
  data: T[];
}
