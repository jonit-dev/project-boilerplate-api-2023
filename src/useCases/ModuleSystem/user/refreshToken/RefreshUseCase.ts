import { IUser } from "@entities/ModuleSystem/UserModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { TS } from "@providers/translation/TranslationHelper";
import { provide } from "inversify-binding-decorators";
import jwt from "jsonwebtoken";

import { appEnv } from "../../../../providers/config/env";
import { ForbiddenError } from "../../../../providers/errors/ForbiddenError";
import { UnauthorizedError } from "../../../../providers/errors/UnauthorizedError";

@provide(RefreshUseCase)
export class RefreshUseCase {
  constructor(private analyticsHelper: AnalyticsHelper) {}

  /**
   * Generates a new accessToken based on a previous refreshToken
   * @param user
   * @param refreshToken
   */
  public async refreshToken(user: IUser, refreshToken: string): Promise<string | false> {
    if (user) {
      await this.analyticsHelper.track("UserTokenRefresh", user);
    }

    if (!refreshToken) {
      throw new UnauthorizedError(TS.translate("auth", "notAllowedResource"));
    }

    if (!user.refreshTokens) {
      throw new BadRequestError(TS.translate("auth", "dontHaveRefreshTokens"));
    }
    if (!user.refreshTokens.find((item) => item.token === refreshToken)) {
      throw new BadRequestError(TS.translate("auth", "refreshTokenInvalid"));
    }

    jwt.verify(refreshToken, appEnv.authentication.REFRESH_TOKEN_SECRET!, (err) => {
      if (err) {
        throw new ForbiddenError(TS.translate("auth", "refreshTokenInvalid"));
      }

      // provide a new accessToken to the user
      const accessToken = jwt.sign(
        { _id: user._id, email: user.email },
        appEnv.authentication.JWT_SECRET!
        // { expiresIn: "20m" }
      );

      return accessToken;
    });
    return false;
  }
}
