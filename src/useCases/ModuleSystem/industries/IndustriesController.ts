import { cache } from "@providers/constants/CacheConstants";
import { controller, httpGet, interfaces, request } from "inversify-express-utils";
import { ReadIndustriesUseCase } from "./read/ReadIndustriesUseCase";

@controller("/industries", cache("24 hours"))
export class IndustriesController implements interfaces.Controller {
  constructor(private readIndustriesUseCase: ReadIndustriesUseCase) {}

  @httpGet("/")
  public industries(@request() req): string[] {
    return this.readIndustriesUseCase.readAll();
  }
}
