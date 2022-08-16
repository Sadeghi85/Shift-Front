import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";

export class ReportService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getSecretaryReport(shiftTabletId: number) {
    return this.api.post(
      "/Report/GetSecretaryReport?shiftTabletId=" + shiftTabletId,
      null,
      {
        responseType: "blob",
      }
    );
  }
}
