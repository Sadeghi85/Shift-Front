import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import { ShiftTabletCrewInputModel } from "@/models/shift-tablet-crew/ShiftTabletCrewInputModel";
import { ShiftTabletCrewViewModel } from "@/models/shift-tablet-crew/ShiftTabletCrewViewModel";
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

  /* public getShiftLocation(id: string) {
    return this.api.get<ApiResponseModel<ShiftLocationViewModel>>(
      `/ShiftLocation/${id}`
    );
  } */

  public createShiftTabletCrew(body: ShiftTabletCrewInputModel) {
    return this.api.post("/ShiftTabletCrew/Register", body);
  }
}
