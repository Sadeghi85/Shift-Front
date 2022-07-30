import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  LocationViewModel,
  LocationInputModel,
  LocationSearchModel,
} from "@/models/LocationModels";

export class LocationService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAll(body: LocationSearchModel) {
    return this.api
      .post<IApiResponseModel<LocationViewModel>>("/Location/GetAll", body)
      .then((response) => {
        if (response.data.success == false) {
          throw {
            message: response.data,
          };
        }

        return response.data;
      });
  }

  public create(body: LocationInputModel) {
    return this.api.post("/Location/Register", body);
  }

  public update(body: LocationInputModel) {
    return this.api.post("/Location/Update", body);
  }

  public delete(body: LocationInputModel) {
    return this.api.post("/Location/Delete", body);
  }
}
