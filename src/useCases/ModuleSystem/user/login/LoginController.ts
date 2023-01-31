import { AuthMiddleware } from "@providers/middlewares/AuthMiddleware";
import { DTOValidatorMiddleware } from "@providers/middlewares/DTOValidatorMiddleware";
import { IAuthResponse } from "@rpg-engine/shared";
import { controller, httpGet, httpPost, interfaces, request, requestBody } from "inversify-express-utils";
import { AuthLoginDTO } from "../AuthDTO";
import { LoginCharacterUseCase } from "./LoginCharacterUseCase";
import { LoginUseCase } from "./LoginUseCase";

//! Reference:
//! Cloud setup: https://medium.com/the-dev-caf%C3%A9/log-in-with-google-oauth-2-0-node-js-and-passport-js-1f8abe096175 (ignore the passport part)
//! Logic: https://medium.com/@tomanagle/google-oauth-with-node-js-4bff90180fe6
@controller("/auth")
export class BasicEmailPwLoginController implements interfaces.Controller {
  constructor(private loginUseCase: LoginUseCase, private loginCharacterUseCase: LoginCharacterUseCase) {}

  @httpPost("/login", DTOValidatorMiddleware(AuthLoginDTO))
  public async login(@requestBody() authLoginDTO: AuthLoginDTO, @request() req): Promise<IAuthResponse> {
    const { accessToken, refreshToken } = await this.loginUseCase.login(authLoginDTO);

    return {
      accessToken,
      refreshToken,
    };
  }

  @httpGet("/login/character/limit", AuthMiddleware)
  public async loginCharacter(@request() req): Promise<boolean> {
    const checkLoginCharacter = await this.loginCharacterUseCase.checkLimit(req.user);

    return checkLoginCharacter;
  }
}
