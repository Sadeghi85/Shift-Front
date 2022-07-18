import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftLocationViewModel,
  ShiftLocationInputModel,
  ShiftLocationSearchModel,
} from "@/models/ShiftLocationModels";

export class ShiftLocationService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getShiftLocations(body: ShiftLocationSearchModel) {
    return this.api
      .post<IApiResponseModel<ShiftLocationViewModel>>(
        "/ShiftLocation/GetAll",
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

  public createShiftLocation(body: ShiftLocationInputModel) {
    return this.api.post("/ShiftLocation/Register", body);
  }

  public updateShiftLocation(body: ShiftLocationInputModel) {
    return this.api.post("/ShiftLocation/Update", body);
  }

  public deleteShiftLocation(body: ShiftLocationInputModel) {
    return this.api.post("/ShiftLocation/Delete", body);
  }
}
