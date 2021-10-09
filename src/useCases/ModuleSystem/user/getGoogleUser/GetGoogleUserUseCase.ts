import { IGoogleOAuthUserInfoResponse } from "@project-remote-job-board/shared";
import { provide } from "inversify-binding-decorators";

import { GoogleOAuthHelper } from "../../../../providers/auth/GoogleOauthHelper";

@provide(GetGoogleUserUseCase)
export class GetGoogleUserUseCase {
  constructor(private googleOAuthHelper: GoogleOAuthHelper) {}

  public async getGoogleUser(code: string): Promise<IGoogleOAuthUserInfoResponse> {
    return await this.googleOAuthHelper.getGoogleUser(code);
  }
}
