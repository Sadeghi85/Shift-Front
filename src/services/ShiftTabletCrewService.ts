import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftTabletCrewViewModel,
  ShiftTabletCrewInputModel,
} from "@/models/ShiftTabletCrewModels";
import { AxiosInstance } from "axios";

export default class ShiftTabletCrewService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getShiftTabletCrews(body: ShiftTabletCrewInputModel) {
    return this.api.post<ApiResponseModel<ShiftTabletCrewViewModel>>(
      "/ShiftTabletCrew/GetAll",
      body
    );
  }

  public getShiftTabletCrewExcel(body: ShiftTabletCrewInputModel) {
    return this.api.post("/ShiftTabletCrew/GetGeExcel", body, {
      responseType: "blob",
    });
  }

  /* public getShiftLocation(id: string) {
    return this.api.get<ApiResponseModel<ShiftLocationViewModel>>(
      `/ShiftLocation/${id}`
    );
  } */

  public createShiftTabletCrew(body: ShiftTabletCrewInputModel) {
    return this.api.post("/ShiftTabletCrew/Register", body);
  }
}
