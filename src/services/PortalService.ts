import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import { PortalModel } from "@/models/PortalModel";
import { AxiosInstance } from "axios";

export default class PortalService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getPortals() {
    return this.api.get<ApiResponseModel<PortalModel>>("/Portal");
  }

  public getPortal(id: string) {
    return this.api.get<ApiResponseModel<PortalModel>>(`/Portal/${id}`);
  }
}
