import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftTabletCrewFullCalendarInputModel,
  ShiftTabletCrewFullCalendarViewModel,
  ShiftTabletFullCalendarInputModel,
  ShiftTabletFullCalendarViewModel,
  ShiftTabletFullReportInputModel,
  ShiftTabletFullReportViewModel,
} from "@/models/ReportModel";

export class ReportService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getShiftTabletFullReport(body: ShiftTabletFullReportInputModel) {
    return this.api
      .post<IApiResponseModel<ShiftTabletFullReportViewModel>>(
        "/Report/GetShiftTabletFullReport",
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

  public getShiftTabletFullCalendar(body: ShiftTabletFullCalendarInputModel) {
    return this.api
      .post<IApiResponseModel<ShiftTabletFullCalendarViewModel>>(
        "/Report/GetShiftTabletFullCalendar",
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

  public getShiftTabletCrewFullCalendar(
    body: ShiftTabletCrewFullCalendarInputModel
  ) {
    return this.api
      .post<IApiResponseModel<ShiftTabletCrewFullCalendarViewModel>>(
        "/Report/GetShiftTabletCrewFullCalendar",
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

  public getSecretaryReport(shiftTabletId: number) {
    return this.api.post(
      "/Report/GetSecretaryReport?shiftTabletId=" + shiftTabletId,
      null,
      {
        responseType: "blob",
      }
    );
  }
}
