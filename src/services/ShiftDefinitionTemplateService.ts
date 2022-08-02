import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftDefinitionTemplateViewModel,
  ShiftDefinitionTemplateSearchModel,
  ShiftDefinitionTemplateInputModel,
} from "@/models/ShiftDefinitionTemplateModels";

export class ShiftDefinitionTemplateService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAll(body: ShiftDefinitionTemplateSearchModel) {
    return this.api
      .post<IApiResponseModel<ShiftDefinitionTemplateViewModel>>(
        "/Shift/ShiftTemplate/GetAll",
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

  public create(body: ShiftDefinitionTemplateInputModel) {
    return this.api.post("/Shift/ShiftTemplate/Register", body);
  }

  public update(body: ShiftDefinitionTemplateInputModel) {
    return this.api.post("/Shift/ShiftTemplate/Update", body);
  }

  public delete(id: number) {
    return this.api.post("/Shift/ShiftTemplate/Delete?id=" + id, null);
  }
}
