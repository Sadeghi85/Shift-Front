import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftTabletViewModel,
  ShiftTabletSearchModel,
  ShiftTabletInputModel,
} from "@/models/ShiftTabletModels";

export class ShiftTabletService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getShiftTablets(body: ShiftTabletSearchModel) {
    return this.api
      .post<IApiResponseModel<ShiftTabletViewModel>>(
        "/ShiftTablet/GetAll",
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

  public createShiftTablet(body: ShiftTabletInputModel) {
    return this.api.post("/ShiftTablet/Register", body);
  }

  public updateShiftTablet(body: ShiftTabletInputModel) {
    return this.api.post("/ShiftTablet/Update", body);
  }

  public deleteShiftTablet(body: ShiftTabletInputModel) {
    return this.api.post("/ShiftTablet/Delete", body);
  }
}
