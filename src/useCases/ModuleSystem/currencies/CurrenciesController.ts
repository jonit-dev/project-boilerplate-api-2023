import { cache } from "@providers/constants/CacheConstants";
import { controller, httpGet, interfaces, request } from "inversify-express-utils";
import { ReadCurrenciesUseCase } from "./read/ReadCurrenciesUseCase";

@controller("/currencies", cache("24 hours"))
export class CurrenciesController implements interfaces.Controller {
  constructor(private readCurrenciesUseCase: ReadCurrenciesUseCase) {}

  @httpGet("/")
  public async currencies(@request() req): Promise<string[]> {
    return await this.readCurrenciesUseCase.readAllAvailable();
  }
}
