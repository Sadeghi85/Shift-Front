import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftLocationViewModel,
  ShiftLocationInputModel,
  ShiftLocationSearchModel,
} from "@/models/ShiftLocationModels";
import { AxiosInstance } from "axios";

export default class ShiftLocationService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getShiftLocations(body: ShiftLocationSearchModel) {
    return this.api
      .post<ApiResponseModel<ShiftLocationViewModel>>(
        "/ShiftLocation/GetAll",
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
