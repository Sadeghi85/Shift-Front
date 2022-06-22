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
    return this.api
      .post<ApiResponseModel<ShiftDefinitionViewModel>>("/Shift/GetAll", body)
      .then((response) => {
        if (response.data.success == false) {
          throw {
            message: response.data,
          };
          //throw new Error("test");
        }

        return response.data;
      });
  }

  public createShiftDefinition(body: ShiftDefinitionInputModel) {
    return this.api.post("/Shift/Register", body);
  }

  public updateShiftDefinition(body: ShiftDefinitionInputModel) {
    return this.api.post("/Shift/Update", body);
  }

  public deleteShiftDefinition(body: ShiftDefinitionInputModel) {
    return this.api.post("/Shift/Delete", body);
  }
}
