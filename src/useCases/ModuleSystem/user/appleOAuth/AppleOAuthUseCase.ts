import { User } from "@entities/ModuleSystem/UserModel";
import { IAuthResponse, UserAuthFlow } from "@project-remote-job-board/shared";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { AppleOAuthHelper } from "@providers/auth/AppleOAuthHelper";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { UserRepository } from "@repositories/ModuleSystem/user/UserRepository";
import { provide } from "inversify-binding-decorators";

import { AppleOAuthDTO } from "../AuthDTO";

@provide(AppleOAuthUseCase)
export class AppleOAuthUseCase {
  constructor(
    private userRepository: UserRepository,
    private analyticsHelper: AnalyticsHelper,
    private appleOAuthHelper: AppleOAuthHelper
  ) {}

  public async appleOAuthSync(appleOAuthDTO: AppleOAuthDTO): Promise<IAuthResponse> {
    const { identityToken, user } = appleOAuthDTO;

    const validationPayload = await this.appleOAuthHelper.verifyIdentityToken(identityToken);

    if (!validationPayload) {
      throw new BadRequestError("Failed to validate Apple identity token");
    }

    // this verifies if the user is the same from our identity token and if the package name is correct
    if (validationPayload.sub !== user || validationPayload.aud !== "com.blueship.mobile") {
      throw new BadRequestError("Apple SignIn: failed to validate user");
    }

    const dbUser = await User.findOne({
      authFlow: UserAuthFlow.AppleOAuth,
      email: validationPayload.email,
    });

    if (!dbUser) {
      if (!appleOAuthDTO.email) {
        throw new BadRequestError(
          "User creation error: No e-mail was provided. Please try signing up by using the traditional Sign Up form."
        );
      }

      const newUser = await this.userRepository.signUp({
        name: appleOAuthDTO.givenName,
        email: appleOAuthDTO.email,
        authFlow: UserAuthFlow.AppleOAuth,
      });

      this.analyticsHelper.track("UserLogin", newUser);
      this.analyticsHelper.track("UserLoginApple", newUser);
      this.analyticsHelper.updateUserInfo(newUser);

      return await newUser.generateAccessToken();
    } else {
      // Check if user already exists on database...
      // just create a new access token and refresh token and provide it

      this.analyticsHelper.track("UserLogin", dbUser);
      this.analyticsHelper.track("UserLoginApple", dbUser);
      this.analyticsHelper.updateUserInfo(dbUser);

      return await dbUser.generateAccessToken();
    }
  }
}
