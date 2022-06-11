import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import { ShiftLocationModel } from "@/models/ShifLocationModel";
import { AxiosInstance } from "axios";

export default class ShiftLocationService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getShiftLocations() {
    return this.api.get<ApiResponseModel<ShiftLocationModel>>("/ShiftLocation");
  }

  public getShiftLocation(id: string) {
    return this.api.get<ApiResponseModel<ShiftLocationModel>>(
      `/ShiftLocation/${id}`
    );
  }

  public createShiftLocation(body: ShiftLocationModel) {
    return this.api.post("/ShiftLocation", body);
  }
}
