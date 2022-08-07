import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftTabletCrewViewModel,
  ShiftTabletCrewSearchModel,
  ShiftTabletCrewInputModel,
} from "@/models/ShiftTabletCrewModels";

export class ShiftTabletCrewService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAll(body: ShiftTabletCrewSearchModel) {
    return this.api
      .post<IApiResponseModel<ShiftTabletCrewViewModel>>(
        "/ShiftTabletCrew/GetAll",
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

  public getExcel(body: ShiftTabletCrewSearchModel) {
    return this.api.post("/ShiftTabletCrew/GetExcel", body, {
      responseType: "blob",
    });
  }

  public getPdf(body: ShiftTabletCrewSearchModel) {
    return this.api.post("/ShiftTabletCrew/Getpdf", body, {
      responseType: "blob",
    });
  }

  public create(body: ShiftTabletCrewInputModel) {
    return this.api.post("/ShiftTabletCrew/Register", body);
  }

  public update(body: ShiftTabletCrewInputModel) {
    return this.api.post("/ShiftTabletCrew/Update", body);
  }

  public hamahangiUpdate(body: ShiftTabletCrewInputModel) {
    return this.api.post("/ShiftTabletCrew/HamahangiUpdate", body);
  }

  public delete(id: number) {
    return this.api.post("/ShiftTabletCrew/Delete?id=" + id, null);
  }
}
