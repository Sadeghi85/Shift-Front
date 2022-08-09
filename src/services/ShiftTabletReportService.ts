import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftTabletReportViewModel,
  ShiftTabletReportSearchModel,
  ShiftTabletReportInputModel,
} from "@/models/ShiftTabletReportModels";

export class ShiftTabletReportService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAll(body: ShiftTabletReportSearchModel) {
    return this.api
      .post<IApiResponseModel<ShiftTabletReportViewModel>>(
        "/ShiftTabletReport/GetAll",
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

  public createOrUpdate(body: ShiftTabletReportInputModel) {
    return this.api.post("/ShiftTabletReport/CreateOrUpdate", body);
  }
}
