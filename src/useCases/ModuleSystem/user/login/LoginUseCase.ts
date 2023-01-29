import { User } from "@entities/ModuleSystem/UserModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { NotFoundError } from "@providers/errors/NotFoundError";
import { TS } from "@providers/translation/TranslationHelper";
import { IAuthResponse } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { AuthLoginDTO } from "../AuthDTO";
import { EMAIL_VALIDATION_REGEX } from "@providers/constants/EmailValidationConstants";

@provide(LoginUseCase)
export class LoginUseCase {
  constructor(private analyticsHelper: AnalyticsHelper) {}

  public async login(authLoginDTO: AuthLoginDTO): Promise<IAuthResponse> {
    const email = authLoginDTO.email.trim();
    const { password } = authLoginDTO;

    // try to find an user using these credentials
    const user = await User.findByCredentials(email, password);

    if (!user) {
      throw new NotFoundError(TS.translate("auth", "invalidCredentials"));
    }

    if (!EMAIL_VALIDATION_REGEX.test(email)) {
      throw new BadRequestError("Sorry, your e-mail is invalid");
    }
    // else, if we got an user with these credentials, lets generate an accessToken

    const { accessToken, refreshToken } = await user.generateAccessToken();

    await this.analyticsHelper.updateUserInfo(user);

    await this.analyticsHelper.track("UserLogin", user);

    return {
      accessToken,
      refreshToken,
    };
  }
}
