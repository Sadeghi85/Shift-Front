// https://levelup.gitconnected.com/use-case-of-singleton-with-axios-and-typescript-da564e76296
import axios, { AxiosInstance, AxiosResponse } from "axios";

declare module "axios" {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

export abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });

    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };

  //private _handleResponse = ({ data }: AxiosResponse) => data;
  private _handleResponse = (response: AxiosResponse) => response;

  protected _handleError = (error: any) => Promise.reject(error);
}
