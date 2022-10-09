import { User } from "@entities/ModuleSystem/UserModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { NotFoundError } from "@providers/errors/NotFoundError";
import { TS } from "@providers/translation/TranslationHelper";
import { UserAuthFlow } from "@rpg-engine/shared";
import randomString from "crypto-random-string";
import { provide } from "inversify-binding-decorators";
import { TransactionalEmail } from "../../../../../emails/TransactionalEmail";
import { appEnv } from "../../../../providers/config/env";
import { InternalServerError } from "../../../../providers/errors/InternalServerError";

@provide(ForgotPasswordUseCase)
export class ForgotPasswordUseCase {
  constructor(private analyticsHelper: AnalyticsHelper) {}

  public async forgotPassword(email: string): Promise<boolean> {
    // try to get user with mentioned e-mail
    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFoundError(TS.translate("users", "userNotFound"));
    }

    await this.analytics.track("ForgotPassword", user);

    if (user.authFlow !== UserAuthFlow.Basic) {
      throw new InternalServerError(TS.translate("auth", "authModeError"));
    }

    // if it succeed, generate a new password and send it back to the user.
    const randomPassword = randomString({ length: 10 });

    user.password = randomPassword;
    await user.save();

    // send e-mail to user with the new password content
    await TransactionalEmail.send(user.email, TS.translate("email", "passwordRecoveryGreetings"), "notification", {
      notificationGreetings: TS.translate("email", "passwordRecoveryGreetings"),
      notificationMessage: TS.translate(
        "email",
        "passwordRecoveryMessage",
        {
          randomPassword,
        },
        false
      ),
      notificationEndPhrase: TS.translate("email", "passwordRecoveryEndPhrase"),
      adminEmail: appEnv.general.ADMIN_EMAIL,
    });

    if (randomPassword) {
      return true;
    } else {
      throw new InternalServerError(
        `Error while trying to generate your new password. Please, contact the server admin at ${appEnv.general.ADMIN_EMAIL}`
      );
    }
  }
}
