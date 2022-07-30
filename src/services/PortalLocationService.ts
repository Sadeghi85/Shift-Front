import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  PortalLocationViewModel,
  PortalLocationInputModel,
  PortalLocationSearchModel,
} from "@/models/PortalLocationModels";

export class PortalLocationService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAll(body: PortalLocationSearchModel) {
    return this.api
      .post<IApiResponseModel<PortalLocationViewModel>>(
        "/PortalLocation/GetAll",
        body
      )
      .then((response) => {
        if (response.data.success == false) {
          throw {
            message: response.data,
          };
        }

        return response.data;
      });
  }

  public create(body: PortalLocationInputModel) {
    return this.api.post("/PortalLocation/Register", body);
  }

  public update(body: PortalLocationInputModel) {
    return this.api.post("/PortalLocation/Update", body);
  }

  public delete(body: PortalLocationInputModel) {
    return this.api.post("/PortalLocation/Delete", body);
  }
}
