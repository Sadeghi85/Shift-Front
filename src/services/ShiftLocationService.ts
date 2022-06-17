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
    return this.api.post<ApiResponseModel<ShiftLocationViewModel>>(
      "/ShiftLocation/GetAll",
      body
    );
  }

  /* public getShiftLocation(id: string) {
    return this.api.get<ApiResponseModel<ShiftLocationViewModel>>(
      `/ShiftLocation/${id}`
    );
  } */

  public createShiftLocation(body: ShiftLocationInputModel) {
    return this.api.post("/ShiftLocation/Register", body);
  }
}
