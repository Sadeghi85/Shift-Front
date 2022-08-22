import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import {
  PaymentInputModel,
  PaymentViewModel,
  PaymentSearchModel,
} from "@/models/PaymentModels";

export class PaymentService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAll(body: PaymentSearchModel) {
    return this.api
      .post<IApiResponseModel<PaymentViewModel>>("/Payment/GetAll", body)
      .then((response) => {
        if (response.data.success == false) {
          throw {
            message: response.data,
          };
        }

        return response.data;
      });
  }

  public update(body: PaymentInputModel) {
    return this.api.post("/Payment/Update", body);
  }
}
