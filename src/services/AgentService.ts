import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import { AgentViewModel, AgentSearchModel } from "@/models/AgentModels";
import { AxiosInstance } from "axios";

export default class AgentService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAgents(body: AgentSearchModel) {
    return this.api
      .post<ApiResponseModel<AgentViewModel>>("/Agent/GetAll", body)
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
}
