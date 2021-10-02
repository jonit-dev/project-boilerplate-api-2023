import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { provide } from "inversify-binding-decorators";

import { axiosCache } from "../constants/AxiosConstants";
import { InternalServerError } from "../errors/InternalServerError";

@provide(APIHelper)
export class APIHelper {
  public async request<T>(
    customAxios: AxiosInstance,
    method: AxiosRequestConfig["method"],
    url: AxiosRequestConfig["url"],
    data?: AxiosRequestConfig["data"]
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await customAxios.request<T>({
        method,
        url,
        data,
        adapter: axiosCache.adapter,
      });
      return response;
    } catch (error: any) {
      console.log(error.message);
      throw new InternalServerError(error.message);
    }
  }
}
