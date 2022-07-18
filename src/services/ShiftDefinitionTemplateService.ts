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

  public getShiftDefinitionTemplates(body: ShiftDefinitionTemplateSearchModel) {
    return this.api
      .post<IApiResponseModel<ShiftDefinitionTemplateViewModel>>(
        "/Shift/NeededResource/GetAll",
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

  public createShiftDefinitionTemplate(
    body: ShiftDefinitionTemplateInputModel
  ) {
    return this.api.post("/Shift/NeededResource/Register", body);
  }

  // public updateShiftDefinition(body: ShiftDefinitionInputModel) {
  //   return this.api.post("/Shift/Update", body);
  // }

  public deleteShiftDefinitionTemplate(
    body: ShiftDefinitionTemplateInputModel
  ) {
    return this.api.post("/Shift/NeededResource/Delete", body);
  }
}
