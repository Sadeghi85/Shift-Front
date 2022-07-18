import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import { PortalViewModel, PortalSearchModel } from "@/models/PortalModels";

export class PortalService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getPortals(body: PortalSearchModel) {
    return this.api
      .post<IApiResponseModel<PortalViewModel>>("/Portal/GetAll", body)
      .then((response) => {
        if (response.data.success == false) {
          throw {
            message: response.data,
          };
        }

        return response.data;
      });
  }
}
