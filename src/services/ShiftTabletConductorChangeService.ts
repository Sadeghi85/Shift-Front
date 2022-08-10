import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  ShiftTabletConductorChangeViewModel,
  ShiftTabletConductorChangeSearchModel,
  ShiftTabletConductorChangeInputModel,
} from "@/models/ShiftTabletConductorChangeModels";

export class ShiftTabletConductorChangeService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAll(body: ShiftTabletConductorChangeSearchModel) {
    return this.api
      .post<IApiResponseModel<ShiftTabletConductorChangeViewModel>>(
        "/ShiftTabletConductorChange/GetAll",
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

  public create(body: ShiftTabletConductorChangeInputModel) {
    return this.api.post("/ShiftTabletConductorChange/Create", body);
  }

  public update(body: ShiftTabletConductorChangeInputModel) {
    return this.api.post("/ShiftTabletConductorChange/Update", body);
  }

  public deleteMultiple(ids: number[] | string) {
    if (typeof ids === "string") {
      return this.api.post(
        "/ShiftTabletConductorChange/DeleteMultiple?ids=" + ids,
        null
      );
    } else {
      return this.api.post(
        "/ShiftTabletConductorChange/DeleteMultiple?ids=" + JSON.stringify(ids),
        null
      );
    }
  }

  public delete(id: number) {
    return this.api.post("/ShiftTabletConductorChange/Delete?id=" + id, null);
  }
}
