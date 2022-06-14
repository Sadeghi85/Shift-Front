import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import { ShiftProductionTypeInputModel } from "@/models/shift-production-type/ShiftProductionTypeInputModel";
import { ShiftProductionTypeViewModel } from "@/models/shift-production-type/ShiftProductionTypeViewModel";
import { AxiosInstance } from "axios";

export default class ShiftProductionTypeService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getShiftProductionTypes(body: ShiftProductionTypeInputModel) {
    return this.api.post<ApiResponseModel<ShiftProductionTypeViewModel>>(
      "/ProductionType/GetAll",
      body
    );
  }

  public createShiftLocation(body: ShiftProductionTypeInputModel) {
    return this.api.post("/ProductionType/Register", body);
  }
}
