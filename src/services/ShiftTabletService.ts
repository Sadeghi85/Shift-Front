import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftTabletViewModel,
  ShiftTabletInputModel,
} from "@/models/ShiftTabletModels";
import { AxiosInstance } from "axios";

export default class ShiftTabletService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getShiftTablets(body: ShiftTabletInputModel) {
    return this.api.post<ApiResponseModel<ShiftTabletViewModel>>(
      "/ShiftTablet/GetAll",
      body
    );
  }

  /* public getShiftLocation(id: string) {
    return this.api.get<ApiResponseModel<ShiftLocationViewModel>>(
      `/ShiftLocation/${id}`
    );
  } */

  public createShiftTablet(body: ShiftTabletInputModel) {
    return this.api.post("/ShiftTablet/Register", body);
  }
}
