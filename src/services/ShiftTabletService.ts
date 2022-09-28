import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftTabletCreateModel,
  ShiftTabletSearchModel,
  ShiftTabletUpdateModel,
  ShiftTabletViewModel,
} from "@/models/ShiftTabletModels";

export class ShiftTabletService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAll(body: ShiftTabletSearchModel) {
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

  public getExcel(body: ShiftTabletSearchModel) {
    return this.api.post("/ShiftTablet/GetExcel", body, {
      responseType: "blob",
    });
  }

  public getPdf(body: ShiftTabletSearchModel) {
    return this.api.post("/ShiftTablet/Getpdf", body, {
      responseType: "blob",
    });
  }

  public create(body: ShiftTabletCreateModel) {
    return this.api.post("/ShiftTablet/Create", body);
  }

  public update(body: ShiftTabletUpdateModel) {
    return this.api.post("/ShiftTablet/Update", body);
  }

  public delete(id: number) {
    return this.api.post("/ShiftTablet/Delete?id=" + id, null);
  }
}
