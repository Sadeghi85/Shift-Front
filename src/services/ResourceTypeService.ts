import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import {
  ResourceTypeViewModel,
  ResourceTypeSearchModel,
} from "@/models/ResourceTypeModels";
import { AxiosInstance } from "axios";

export default class ResourceTypeService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getResourceTypes(body: ResourceTypeSearchModel) {
    return this.api
      .post<ApiResponseModel<ResourceTypeViewModel>>(
        "/ResourceType/GetAll",
        body
      )
      .then((response) => {
        if (response.data.success == false) {
          throw {
            message: response.data,
          };
          //throw new Error("test");
        }

        return response.data;
      });
  }
}
