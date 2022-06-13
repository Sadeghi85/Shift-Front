import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import { ShiftLocationInputModel } from "@/models/input-models/ShiftLocationInputModel";
import { ShiftLocationViewModel } from "@/models/ShifLocationViewModel";
import { AxiosInstance } from "axios";

export default class ShiftLocationService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getShiftLocations(pageNumber: number, pageSize: number) {
    return this.api.get<ApiResponseModel<ShiftLocationViewModel>>(
      "/ShiftLocation?" + "pageNumber=" + pageNumber + "&pageSize=" + pageSize
    );
  }

  public getShiftLocation(id: string) {
    return this.api.get<ApiResponseModel<ShiftLocationViewModel>>(
      `/ShiftLocation/${id}`
    );
  }

  public createShiftLocation(body: ShiftLocationInputModel) {
    return this.api.post("/ShiftLocation", body);
  }
}
