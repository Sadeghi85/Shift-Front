import { Api } from "@/http-client/api";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import { AgentViewModel } from "@/models/AgentModels";
import { AxiosInstance } from "axios";
import { AgentInputModel } from "@/models/AgentModels";

export default class AgentService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAgents(body: AgentInputModel) {
    return this.api.post<ApiResponseModel<AgentViewModel>>(
      "/Agent/GetAll",
      body
    );
  }

  // public getPortal(id: string) {
  //   return this.api.get<ApiResponseModel<PortalViewModel>>(`/Portal/${id}`);
  // }
}
