import { User } from "@entities/ModuleSystem/UserModel";
import { IAuthResponse } from "@project-remote-job-board/shared";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { NotFoundError } from "@providers/errors/NotFoundError";
import { TS } from "@providers/translation/TranslationHelper";
import { provide } from "inversify-binding-decorators";

import { AuthLoginDTO } from "../AuthDTO";

@provide(LoginUseCase)
export class LoginUseCase {
  constructor(private analyticsHelper: AnalyticsHelper) {}

  public async login(authLoginDTO: AuthLoginDTO): Promise<IAuthResponse> {
    const { email, password } = authLoginDTO;

    // try to find an user using these credentials
    const user = await User.findByCredentials(email, password);

    if (!user) {
      throw new NotFoundError(TS.translate("auth", "invalidCredentials"));
    }

    // else, if we got an user with these credentials, lets generate an accessToken

    const { accessToken, refreshToken } = await user.generateAccessToken();

    this.analyticsHelper.updateUserInfo(user);

    this.analyticsHelper.track("UserLogin", user);

    return {
      accessToken,
      refreshToken,
    };
  }
}
