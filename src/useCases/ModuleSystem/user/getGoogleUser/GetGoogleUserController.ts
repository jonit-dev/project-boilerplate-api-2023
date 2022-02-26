import { User } from "@entities/ModuleSystem/UserModel";
import { IGoogleOAuthUserInfoResponse, UserAuthFlow } from "@rpg-engine/shared";
import { Request, Response } from "express";
import { controller, httpGet, interfaces } from "inversify-express-utils";
import { appEnv } from "../../../../providers/config/env";
import { GoogleOAuthSyncUseCase } from "../googleOAuthSync/GoogleOAuthSyncUseCase";
import { GetGoogleUserUseCase } from "./GetGoogleUserUseCase";

//! Reference:
//! Cloud setup: https://medium.com/the-dev-caf%C3%A9/log-in-with-google-oauth-2-0-node-js-and-passport-js-1f8abe096175 (ignore the passport part)
//! Logic: https://medium.com/@tomanagle/google-oauth-with-node-js-4bff90180fe6
@controller("/auth")
export class GetGoogleUserController implements interfaces.Controller {
  constructor(
    private getGoogleUserUseCase: GetGoogleUserUseCase,
    private googleOAuthSyncUseCase: GoogleOAuthSyncUseCase
  ) {}

  @httpGet("/google/redirect")
  public async googleOAuthRedirect(req: Request, res: Response): Promise<any> {
    const {
      code,
      // scope
    } = req.query;

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
}
