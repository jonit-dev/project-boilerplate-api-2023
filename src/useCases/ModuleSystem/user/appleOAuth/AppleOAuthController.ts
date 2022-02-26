import { User } from "@entities/ModuleSystem/UserModel";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { DTOValidatorMiddleware } from "@providers/middlewares/DTOValidatorMiddleware";
import { TS } from "@providers/translation/TranslationHelper";
import { IAuthResponse, UserAuthFlow } from "@rpg-engine/shared";
import { controller, httpPost, interfaces, request, requestBody } from "inversify-express-utils";
import { AppleOAuthDTO } from "../AuthDTO";
import { AppleOAuthUseCase } from "./AppleOAuthUseCase";

@controller("/auth")
export class AppleOAuthController implements interfaces.Controller {
  constructor(private appleOAuthUseCase: AppleOAuthUseCase) {}

  @httpPost("/apple", DTOValidatorMiddleware(AppleOAuthDTO))
  public async appleOAuth(@requestBody() appleOAuthDTO: AppleOAuthDTO, @request() req): Promise<IAuthResponse> {
    // Check if this user was registered using a Basic auth flow (instead of Google OAuth)
    const userWithBasic = await User.findOne({ email: appleOAuthDTO.email, authFlow: UserAuthFlow.Basic });

    if (userWithBasic) {
      throw new BadRequestError(TS.translate("auth", "accountAuthFlowMismatch"));
    }

    const { accessToken, refreshToken } = await this.appleOAuthUseCase.appleOAuthSync(appleOAuthDTO);

    return {
      accessToken,
      refreshToken,
    };
  }
}
