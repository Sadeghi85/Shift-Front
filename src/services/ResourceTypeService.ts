import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import {
  ResourceTypeViewModel,
  ResourceTypeInputModel,
} from "@/models/ResourceTypeModels";
import { AxiosInstance } from "axios";

export default class ResourceTypeService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getResourceTypes(body: ResourceTypeInputModel) {
    return this.api.post<ApiResponseModel<ResourceTypeViewModel>>(
      "/ResourceType/GetAll",
      body
    );
  }

  // public getPortal(id: string) {
  //   return this.api.get<ApiResponseModel<PortalViewModel>>(`/Portal/${id}`);
  // }
}
