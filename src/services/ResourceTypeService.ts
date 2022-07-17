import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  ResourceTypeViewModel,
  ResourceTypeSearchModel,
} from "@/models/ResourceTypeModels";

export default class ResourceTypeService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getResourceTypes(body: ResourceTypeSearchModel) {
    return this.api
      .post<IApiResponseModel<ResourceTypeViewModel>>(
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
