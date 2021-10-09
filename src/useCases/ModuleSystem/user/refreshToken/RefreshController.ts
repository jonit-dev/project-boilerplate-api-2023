import { HttpStatus, IAuthRefreshTokenResponse } from "@project-remote-job-board/shared";
import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { DTOValidatorMiddleware } from "@providers/middlewares/DTOValidatorMiddleware";
import { TS } from "@providers/translation/TranslationHelper";
import { controller, httpPost, interfaces } from "inversify-express-utils";

import { InternalServerError } from "../../../../providers/errors/InternalServerError";
import { IAuthenticatedRequest } from "../../../../providers/types/ExpressTypes";
import { AuthRefreshTokenDTO } from "../AuthDTO";
import { RefreshUseCase } from "./RefreshUseCase";

//! Reference:
//! Cloud setup: https://medium.com/the-dev-caf%C3%A9/log-in-with-google-oauth-2-0-node-js-and-passport-js-1f8abe096175 (ignore the passport part)
//! Logic: https://medium.com/@tomanagle/google-oauth-with-node-js-4bff90180fe6
@controller("/auth")
export class RefreshController implements interfaces.Controller {
  constructor(private refreshUseCase: RefreshUseCase) {}

  @httpPost("/refresh-token", DTOValidatorMiddleware(AuthRefreshTokenDTO), AuthMiddleware)
  public async refreshToken(req: IAuthenticatedRequest, res): Promise<IAuthRefreshTokenResponse> {
    // These variables will always be defined, since we have the DTO validation that happens before the code below.
    const refreshToken = req.body.refreshToken!;
    const user = req.user!;

    const accessToken = await this.refreshUseCase.refreshToken(user, refreshToken);

    if (!accessToken) {
      throw new InternalServerError(TS.translate("auth", "oauthAccessTokenError"));
    }

    return res.status(HttpStatus.OK).send({
      accessToken,
    });
  }
}
