import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import { JobViewModel, JobSearchModel } from "@/models/JobModels";

export class JobService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getAll(body: JobSearchModel) {
    return this.api
      .post<IApiResponseModel<JobViewModel>>("/Job/GetAll", body)
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
