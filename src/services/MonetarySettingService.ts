import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  MonetarySettingViewModel,
  MonetarySettingSearchModel,
  MonetarySettingInputModel,
} from "@/models/MonetarySettingModels";

export class MonetarySettingService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAll(body: MonetarySettingSearchModel) {
    return this.api
      .post<IApiResponseModel<MonetarySettingViewModel>>(
        "/MonetarySetting/GetAll",
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

  public createOrUpdate(body: MonetarySettingInputModel) {
    return this.api.post("/MonetarySetting/CreateOrUpdate", body);
  }

  public deleteMultiple(ids: number[] | string) {
    if (typeof ids === "string") {
      return this.api.post("/MonetarySetting/DeleteMultiple?ids=" + ids, null);
    } else {
      return this.api.post(
        "/MonetarySetting/DeleteMultiple?ids=" + JSON.stringify(ids),
        null
      );
    }
  }

  public delete(id: number) {
    return this.api.post("/MonetarySetting/Delete?id=" + id, null);
  }
}
