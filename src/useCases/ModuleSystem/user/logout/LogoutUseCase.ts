import { IUser } from "@entities/ModuleSystem/UserModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { provide } from "inversify-binding-decorators";

@provide(LogoutUseCase)
export class LogoutUseCase {
  constructor(private analyticsHelper: AnalyticsHelper) {}

  public async logout(user: IUser, refreshToken: string): Promise<void> {
    //! Remember that JWT tokens are stateless, so there's nothing on server side to remove besides our refresh tokens. Make sure that you wipe out all JWT data from the client. Read more at: https://stackoverflow.com/questions/37959945/how-to-destroy-jwt-tokens-on-logout#:~:text=You%20cannot%20manually%20expire%20a,DB%20query%20on%20every%20request.

    // remove refresh token from Db
    user.refreshTokens = user.refreshTokens?.filter((item) => item.token !== refreshToken);

    await user.save();

    this.analyticsHelper.track("UserLogout", user);
  }
}
