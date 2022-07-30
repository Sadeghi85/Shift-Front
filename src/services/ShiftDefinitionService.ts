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

  public getAll(body: ShiftDefinitionSearchModel) {
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

  public create(body: ShiftDefinitionInputModel) {
    return this.api.post("/Shift/Register", body);
  }

  public update(body: ShiftDefinitionInputModel) {
    return this.api.post("/Shift/Update", body);
  }

  public delete(body: ShiftDefinitionInputModel) {
    return this.api.post("/Shift/Delete", body);
  }
}
