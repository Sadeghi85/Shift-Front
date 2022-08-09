import { Api } from "@/http-client/api";
import { AxiosInstance } from "axios";
import { IApiResponseModel } from "@/models/ApiResponseModel";
import { IUserViewModel } from "@/models/UserModels";

export class UserService {
  private api: AxiosInstance;
  constructor() {
    this.api = Api.getInstance();
  }

  public getUserInfo() {
    return this.api
      .post<IUserViewModel>("/User/GetUserInfo")
      .then((response) => {
        return response.data;
      });
  }

  // public create(body: UserInputModel) {
  //   return this.api.post("/User/Register", body);
  // }
}
