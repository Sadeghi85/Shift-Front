import { AxiosRequestConfig } from "axios";
import { HttpClient } from "./http-client";
import { AppSettings } from "@/config";
import { TokenViewModel, TokenInputModel } from "@/models/TokenModels";
import useTokenStore from "@/stores/token";
/* import { PortalModel } from "@/models/PortalModel";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import { ShiftLocationModel } from "@/models/ShifLocationModel"; */

export class Api extends HttpClient {
  private static classInstance?: Api;

  private tokenStore;

  private constructor() {
    super(AppSettings.API_URL);

    this.tokenStore = useTokenStore();

    this._initializeRequestInterceptor();
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new Api();
    }

    //return this.classInstance;
    return this.classInstance.instance;
  }

  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      async (config) => {
        const token = this.tokenStore.token;

        config.headers = {
          Authorization: `Bearer ${token?.access_token}`,
          // Accept: "application/json",
          // "Content-Type": "application/x-www-form-urlencoded",
        };
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          let token: TokenViewModel | null = null;

          try {
            token = await Api.classInstance!.getToken({
              refresh_token: Api.classInstance!.tokenStore.token?.refresh_token,
            } as TokenInputModel);
          } catch (error) {
            console.log(error);
          }

          Api.classInstance!.instance.defaults.headers.common["Authorization"] =
            "Bearer " + token?.access_token;
          return Api.classInstance!.instance(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  };

  public async getToken(body: TokenInputModel | null) {
    return this.instance.post<TokenViewModel>(AppSettings.SSO_URL, body);
    // .then((response) => {
    //   this.tokenStore.setToken(response.data);
    // }).catch((error) => {
    //   console.log(error);
    // });
  }

  /* public getPortals = () =>
    this.instance.get<ApiResponseModel<PortalModel>>("/Portal");

  public getPortal = (id: string) =>
    this.instance.get<ApiResponseModel<PortalModel>>(`/Portal/${id}`);

  public createShiftLocation = (body: ShiftLocationModel) =>
    this.instance.post("/ShiftLocation", body); */
}
