export interface ApiResponseModel<T> {
  success: boolean;
  failureMessage: string;
  totalCount: number;
  data: T[];
}
