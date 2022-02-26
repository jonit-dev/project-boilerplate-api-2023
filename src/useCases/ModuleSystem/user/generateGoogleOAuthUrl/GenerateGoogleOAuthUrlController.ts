import { IGoogleOAuthUrlResponse } from "@rpg-engine/shared";
import { Request, Response } from "express";
import { controller, httpGet, interfaces } from "inversify-express-utils";
import { GenerateGoogleOAuthUrlUseCase } from "./GenerateGoogleOAuthUrlUseCase";

//! Reference:
//! Cloud setup: https://medium.com/the-dev-caf%C3%A9/log-in-with-google-oauth-2-0-node-js-and-passport-js-1f8abe096175 (ignore the passport part)
//! Logic: https://medium.com/@tomanagle/google-oauth-with-node-js-4bff90180fe6
@controller("/auth")
export class GenerateGoogleOAuthUrlController implements interfaces.Controller {
  constructor(private generateGoogleOAuthUseCase: GenerateGoogleOAuthUrlUseCase) {}

  @httpGet("/google/url")
  public async generateGoogleOAuthUrl(req: Request, res: Response): Promise<Response<IGoogleOAuthUrlResponse>> {
    const googleOAuthUrl = await this.generateGoogleOAuthUseCase.generateGoogleOAuthUrl();
    return res.status(200).send({
      googleOAuthUrl,
    });
  }
}
