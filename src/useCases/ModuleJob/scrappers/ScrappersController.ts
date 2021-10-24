import { controller, httpPost, interfaces, requestBody } from "inversify-express-utils";

import { CheckUrlsScrappersUseCase } from "./checkUrls/CheckUrlsScrappersUseCase";

@controller("/scrappers")
export class ScrappersController implements interfaces.Controller {
  constructor(private checkUrlsScrappersUseCase: CheckUrlsScrappersUseCase) {}

  @httpPost("/check-urls")
  public async checkUrls(@requestBody() body): Promise<any> {
    const { urls } = body;

    return await this.checkUrlsScrappersUseCase.checkUrls(urls);
  }
}
