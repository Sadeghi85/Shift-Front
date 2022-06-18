import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftDefinitionViewModel,
  ShiftDefinitionSearchModel,
  ShiftDefinitionInputModel,
} from "@/models/ShiftDefinitionModels";
import { AxiosInstance } from "axios";

export default class ShiftDefinitionService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getShiftDefinitions(body: ShiftDefinitionSearchModel) {
    return this.api.post<ApiResponseModel<ShiftDefinitionViewModel>>(
      "/Shift/GetAll",
      body
    );
  }

  /* public getShiftLocation(id: string) {
    return this.api.get<ApiResponseModel<ShiftLocationViewModel>>(
      `/ShiftLocation/${id}`
    );
  } */

  public createShiftDefinition(body: ShiftDefinitionInputModel) {
    return this.api.post("/Shift/Register", body);
  }
}
