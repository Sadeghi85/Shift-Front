import { AxiosRequestConfig } from "axios";
import { HttpClient } from "./http-client";
import { AppSettings } from "@/config";
import { ITokenViewModel, ITokenInputModel } from "@/models/TokenModels";
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
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
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

        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry &&
          Api.classInstance
        ) {
          originalRequest._retry = true;
          let token: ITokenViewModel | null = null;

          try {
            const tokenResponse = await fetch(AppSettings.SSO_URL, {
              method: "post",
              headers: new Headers({
                "Content-Type": "application/json; charset=utf-8",
              }),
              body: JSON.stringify({
                refresh_token:
                  Api.classInstance.tokenStore.token?.refresh_token,
              } as ITokenInputModel),
            });

            token = await tokenResponse.json();

            Api.classInstance.tokenStore.setToken(token);
          } catch (error) {
            console.log(error);
          }

          if (token) {
            Api.classInstance.instance.defaults.headers.common[
              "Authorization"
            ] = "Bearer " + token.access_token;

            return Api.classInstance.instance(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );
  };

  /* public getPortals = () =>
    this.instance.get<ApiResponseModel<PortalModel>>("/Portal");

  public getPortal = (id: string) =>
    this.instance.get<ApiResponseModel<PortalModel>>(`/Portal/${id}`);

  public createShiftLocation = (body: ShiftLocationModel) =>
    this.instance.post("/ShiftLocation", body); */
}
