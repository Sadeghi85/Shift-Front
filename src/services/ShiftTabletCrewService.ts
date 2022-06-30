import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftTabletCrewViewModel,
  ShiftTabletCrewSearchModel,
  ShiftTabletCrewInputModel,
} from "@/models/ShiftTabletCrewModels";
import { AxiosInstance } from "axios";

export default class ShiftTabletCrewService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getShiftTabletCrews(body: ShiftTabletCrewSearchModel) {
    return this.api
      .post<ApiResponseModel<ShiftTabletCrewViewModel>>(
        "/ShiftTabletCrew/GetAll",
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

  public getShiftTabletCrewExcel(body: ShiftTabletCrewSearchModel) {
    return this.api.post("/ShiftTabletCrew/GetGeExcel", body, {
      responseType: "blob",
    });
  }

  public getShiftTabletCrewPdf(body: ShiftTabletCrewSearchModel) {
    return this.api.post("/ShiftTabletCrew/Getpdf", body, {
      responseType: "blob",
    });
  }

  public createShiftTabletCrew(body: ShiftTabletCrewInputModel) {
    return this.api.post("/ShiftTabletCrew/Register", body);
  }

  public updateShiftTabletCrew(body: ShiftTabletCrewInputModel) {
    return this.api.post("/ShiftTabletCrew/Update", body);
  }

  public deleteShiftTabletCrew(body: ShiftTabletCrewInputModel) {
    return this.api.post("/ShiftTabletCrew/Delete", body);
  }
}
