import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import { ShiftLocationInputModel } from "@/models/shift-location/ShiftLocationInputModel";
import { ShiftLocationViewModel } from "@/models/shift-location/ShiftLocationViewModel";
import { AxiosInstance } from "axios";

export default class ShiftLocationService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getShiftLocations(body: ShiftLocationInputModel) {
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
