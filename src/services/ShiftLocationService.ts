import { Api } from "@/http-client/api";
import { ShiftLocationModel } from "@/models/ShifLocationModel";
import { AxiosInstance } from "axios";

export default class ShiftLocationService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public createShiftLocation(body: ShiftLocationModel) {
    return this.api.post("/ShiftLocation", body);
  }
}
