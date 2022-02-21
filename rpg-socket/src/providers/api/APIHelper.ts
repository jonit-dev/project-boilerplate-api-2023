import { AxiosRequestConfig } from "axios";
import { provide } from "inversify-binding-decorators";
import { API_AXIOS } from "../constants/apiAxios";

@provide(APIHelper)
export class APIHelper {
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await API_AXIOS.request(config);

      return response.data as T;
    } catch (error) {
      console.error(error);
      throw Error("API request failed");
    }
  }
}
