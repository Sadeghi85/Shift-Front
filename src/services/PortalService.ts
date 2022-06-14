import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import { PortalViewModel } from "@/models/portal/PortalViewModel";
import { AxiosInstance } from "axios";

export default class PortalService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getPortals() {
    return this.api.get<ApiResponseModel<PortalViewModel>>("/Portal");
  }

  public getPortal(id: string) {
    return this.api.get<ApiResponseModel<PortalViewModel>>(`/Portal/${id}`);
  }
}
