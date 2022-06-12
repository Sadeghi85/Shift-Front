import { AxiosRequestConfig } from "axios";
import { HttpClient } from "./http-client";
import { URL } from "@/config";
/* import { PortalModel } from "@/models/PortalModel";
import { ApiResponseModel } from "@/models/ApiResponseModel";
import { ShiftLocationModel } from "@/models/ShifLocationModel"; */

export class Api extends HttpClient {
  private static classInstance?: Api;

  private constructor() {
    super(URL.API_URL);

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
      this._handleRequest,
      this._handleError
    );
  };

  private _handleRequest = (config: AxiosRequestConfig) => {
    if (config.headers) {
      config.headers["Authorization"] = "Bearer ...";
    }

    return config;
  };

  /* public getPortals = () =>
    this.instance.get<ApiResponseModel<PortalModel>>("/Portal");

  public getPortal = (id: string) =>
    this.instance.get<ApiResponseModel<PortalModel>>(`/Portal/${id}`);

  public createShiftLocation = (body: ShiftLocationModel) =>
    this.instance.post("/ShiftLocation", body); */
}
