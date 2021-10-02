import { HttpStatus } from "@project-stock-alarm/shared";
import { Response } from "express";
import { controller, httpPost, interfaces, requestBody } from "inversify-express-utils";

import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { DTOValidatorMiddleware } from "@providers/middlewares/DTOValidatorMiddleware";
import { IAuthenticatedRequest } from "../../../../providers/types/ExpressTypes";
import { AuthRefreshTokenDTO } from "../AuthDTO";
import { LogoutUseCase } from "./LogoutUseCase";

//! Reference:
//! Cloud setup: https://medium.com/the-dev-caf%C3%A9/log-in-with-google-oauth-2-0-node-js-and-passport-js-1f8abe096175 (ignore the passport part)
//! Logic: https://medium.com/@tomanagle/google-oauth-with-node-js-4bff90180fe6
@controller("/auth")
export class LogoutController implements interfaces.Controller {
  constructor(private logoutUseCase: LogoutUseCase) {}

  @httpPost("/logout", DTOValidatorMiddleware(AuthRefreshTokenDTO), AuthMiddleware)
  public async logout(@requestBody() authRefreshTokenDTO, req: IAuthenticatedRequest, res: Response): Promise<any> {
    const { refreshToken } = authRefreshTokenDTO;

    const user = req.user!;

    await this.logoutUseCase.logout(user, refreshToken);

    return res.status(HttpStatus.OK).send();
  }
}
