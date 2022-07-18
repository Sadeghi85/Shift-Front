import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftDefinitionViewModel,
  ShiftDefinitionSearchModel,
  ShiftDefinitionInputModel,
} from "@/models/ShiftDefinitionModels";

export class ShiftDefinitionService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getShiftDefinitions(body: ShiftDefinitionSearchModel) {
    return this.api
      .post<IApiResponseModel<ShiftDefinitionViewModel>>("/Shift/GetAll", body)
      .then((response) => {
        if (response.data.success == false) {
          throw {
            message: response.data,
          };
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
