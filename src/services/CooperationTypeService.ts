import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  CooperationTypeViewModel,
  CooperationTypeSearchModel,
} from "@/models/CooperationTypeModels";

export class CooperationTypeService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAll(body: CooperationTypeSearchModel) {
    return this.api
      .post<IApiResponseModel<CooperationTypeViewModel>>(
        "/CooperationType/GetAll",
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
}
