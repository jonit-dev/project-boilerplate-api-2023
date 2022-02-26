import { User } from "@entities/ModuleSystem/UserModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { TS } from "@providers/translation/TranslationHelper";
import { IGoogleOAuthIdTokenResponse, IGoogleOAuthUserInfoResponse, UserAuthFlow } from "@rpg-engine/shared";
import { Request, Response } from "express";
import { controller, httpGet, httpPost, interfaces } from "inversify-express-utils";
import { GoogleOAuthHelper } from "../../../../providers/auth/GoogleOauthHelper";
import { appEnv } from "../../../../providers/config/env";
import { GetGoogleUserUseCase } from "../getGoogleUser/GetGoogleUserUseCase";
import { GoogleOAuthSyncUseCase } from "./GoogleOAuthSyncUseCase";

//! Reference:
//! Cloud setup: https://medium.com/the-dev-caf%C3%A9/log-in-with-google-oauth-2-0-node-js-and-passport-js-1f8abe096175 (ignore the passport part)
//! Logic: https://medium.com/@tomanagle/google-oauth-with-node-js-4bff90180fe6
@controller("/auth")
export class GoogleOAuthSyncController implements interfaces.Controller {
  constructor(
    private getGoogleUserUseCase: GetGoogleUserUseCase,
    private googleOAuthSyncUseCase: GoogleOAuthSyncUseCase,
    private googleOAuthHelper: GoogleOAuthHelper,
    private analyticsHelper: AnalyticsHelper
  ) {}

  //! This is for web based oauth flow only! Does not work with Ionic
  @httpGet("/google/redirect")
  public async googleOAuth(req: Request, res: Response): Promise<any> {
    const { code } = req.query;

    const googleUserInfo: IGoogleOAuthUserInfoResponse = await this.getGoogleUserUseCase.getGoogleUser(String(code));

    // Check if this user was registered using a Basic auth flow (instead of Google OAuth)
    const user = await User.findOne({ email: googleUserInfo.email });

    if (user && user.authFlow === UserAuthFlow.Basic) {
      // on this case it's google only oauth method...
      return res.redirect(`${appEnv.general.APP_URL}/auth?errorType=auth&&errorMessage=accountAuthFlowMismatch`);
    }

    const { accessToken, refreshToken } = await this.googleOAuthSyncUseCase.googleOAuthSync(googleUserInfo);

    // redirect to our APP with a provided accessToken ( so he can fetch his user info )
    return res.redirect(`${appEnv.general.APP_URL}/auth?&accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }

  @httpPost("/google/mobile")
  public async googleOAuthMobile(req, res: Response): Promise<any> {
    const { idToken } = req.body;

    if (!idToken) {
      throw new BadRequestError(
        TS.translate("validation", "isNotEmpty", {
          field: "idToken",
        })
      );
    }

    const isIdTokenValid = await this.googleOAuthHelper.validateIdToken(idToken);

    if (!isIdTokenValid) {
      throw new BadRequestError(
        TS.translate("validation", "isInvalid", {
          field: "idToken",
        })
      );
    }

    const googleUserInfo: IGoogleOAuthIdTokenResponse | undefined =
      await this.googleOAuthHelper.getGoogleUserFromIdToken(idToken);

    if (!googleUserInfo) {
      console.log("Failed to fetch user information from IDToken");
      throw new BadRequestError(
        TS.translate("validation", "isInvalid", {
          field: "googleUserInfo",
        })
      );
    }

    // Check if this user was registered using a Basic auth flow (instead of Google OAuth)
    const user = await User.findOne({ email: googleUserInfo.email });

    if (user && user.authFlow === UserAuthFlow.Basic) {
      // on this case it's google only oauth method...
      throw new BadRequestError(TS.translate("auth", "accountAuthFlowMismatch"));
    }
    const { accessToken, refreshToken } = await this.googleOAuthSyncUseCase.googleOAuthSync(googleUserInfo);

    return {
      accessToken,
      refreshToken,
    };
  }
}
