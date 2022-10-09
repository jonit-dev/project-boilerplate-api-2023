import { IUser } from "@entities/ModuleSystem/UserModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { TS } from "@providers/translation/TranslationHelper";
import bcrypt from "bcrypt";
import { provide } from "inversify-binding-decorators";

import { TransactionalEmail } from "../../../../../emails/TransactionalEmail";
import { appEnv } from "../../../../providers/config/env";
import { AuthChangePasswordDTO } from "../AuthDTO";

@provide(ChangePasswordUseCase)
export class ChangePasswordUseCase {
  constructor(private analyticsHelper: AnalyticsHelper) {}

  public async changePassword(user: IUser, authChangePasswordDTO: AuthChangePasswordDTO): Promise<void> {
    await this.analytics.track("ChangePassword", user);

    const { currentPassword, newPassword } = authChangePasswordDTO;

    // check if passwords are the same

    if (currentPassword === newPassword) {
      throw new BadRequestError(TS.translate("auth", "changePasswordSamePasswords"));
    }

    // check if current password is correct

    const currentPasswordHash = await bcrypt.hash(currentPassword, user.salt!);

    // compare both hashes
    if (currentPasswordHash === user.password) {
      // if currentPassword is correct, just change our current password to the new one provided.
      user.password = newPassword;
      await user.save();

      // Send confirmation to user
      await TransactionalEmail.send(user.email, TS.translate("email", "passwordChangeTitle"), "notification", {
        notificationGreetings: TS.translate("email", "genericConfirmationTitle"),
        notificationMessage: TS.translate("email", "passwordChangeMessage", {
          adminEmail: appEnv.general.ADMIN_EMAIL!,
        }),
        notificationEndPhrase: TS.translate("email", "genericEndPhrase"),
      });
    } else {
      throw new BadRequestError(TS.translate("auth", "changePasswordIncorrectCurrentPassword"));
    }
  }
}
