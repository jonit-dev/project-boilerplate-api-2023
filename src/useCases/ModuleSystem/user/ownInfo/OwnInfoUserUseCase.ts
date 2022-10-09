import { IUser } from "@entities/ModuleSystem/UserModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { TS } from "@providers/translation/TranslationHelper";
import { provide } from "inversify-binding-decorators";

@provide(OwnInfoUserUseCase)
export class OwnInfoUserUseCase {
  constructor(private analyticsHelper: AnalyticsHelper) {}

  public async getUserInfo(user: IUser): Promise<IUser> {
    if (!user) {
      throw new BadRequestError(TS.translate("users", "userNotFound"));
    }

    await this.analyticsHelper.updateUserInfo(user);

    await this.analyticsHelper.track("UserInfo", user);

    return user;
  }
}
