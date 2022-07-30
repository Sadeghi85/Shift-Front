import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { AgentSearchModel, AgentViewModel } from "@/models/AgentModels";
import { IApiResponseModel } from "@/models/ApiResponseModel";

export class AgentService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAll(body: AgentSearchModel) {
    return this.api
      .post<IApiResponseModel<AgentViewModel>>("/Agent/GetAll", body)
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
