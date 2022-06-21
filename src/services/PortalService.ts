import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import { PortalViewModel, PortalSearchModel } from "@/models/PortalModels";
import { AxiosInstance } from "axios";

export default class PortalService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getPortals(body: PortalSearchModel) {
    return this.api.post<ApiResponseModel<PortalViewModel>>(
      "/Portal/GetAll",
      body
    );
  }
}
