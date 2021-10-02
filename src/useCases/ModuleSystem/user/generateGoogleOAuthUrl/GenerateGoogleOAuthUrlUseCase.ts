import { provide } from "inversify-binding-decorators";

import { GoogleOAuthHelper } from "../../../../providers/auth/GoogleOauthHelper";

@provide(GenerateGoogleOAuthUrlUseCase)
export class GenerateGoogleOAuthUrlUseCase {
  constructor(private googleOAuthHelper: GoogleOAuthHelper) {}

  public async generateGoogleOAuthUrl(): Promise<string> {
    return await this.googleOAuthHelper.urlGoogle();
  }
}
