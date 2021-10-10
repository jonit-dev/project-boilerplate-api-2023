import { controller, httpGet, interfaces, request } from "inversify-express-utils";

import { ReadIndustriesUseCase } from "./read/ReadIndustriesUseCase";

@controller("/industries")
export class IndustriesController implements interfaces.Controller {
  constructor(private readIndustriesUseCase: ReadIndustriesUseCase) {}

  @httpGet("/")
  public industries(@request() req): string[] {
    return this.readIndustriesUseCase.readAll();
  }
}
