import { User } from "@entities/ModuleSystem/UserModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { BadRequestError } from "@providers/errors/BadRequestError";
import { NotFoundError } from "@providers/errors/NotFoundError";
import { TS } from "@providers/translation/TranslationHelper";
import { IAuthResponse } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { AuthLoginDTO } from "../AuthDTO";
import { EMAIL_VALIDATION_REGEX } from "@providers/constants/EmailValidationConstants";
import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { USER_CONTROL_ONLINE } from "@providers/constants/ServerConstants";

@provide(LoginUseCase)
export class LoginUseCase {
  constructor(private analyticsHelper: AnalyticsHelper) {}

  public async login(authLoginDTO: AuthLoginDTO): Promise<IAuthResponse> {
    const email = authLoginDTO.email.trim();
    const { password } = authLoginDTO;

    // try to find an user using these credentials
    const user = await User.findByCredentials(email, password);

    if (!user) {
      throw new NotFoundError(TS.translate("auth", "invalidCredentials"));
    }

    if (!EMAIL_VALIDATION_REGEX.test(email)) {
      throw new BadRequestError("Sorry, your e-mail is invalid");
    }

    const maxCharacterOnlinePerUser = await Character.countDocuments({ owner: user._id, isOnline: true });

    if (maxCharacterOnlinePerUser >= USER_CONTROL_ONLINE.MAX_NUMBER_ACC_PER_USER) {
      throw new BadRequestError(
        "Sorry. Number of characters online per player reached. Please try again in a few minutes."
      );
    }

    const allUsersOnline = await Character.find({ isOnline: true }).select("owner").exec();

    const result = allUsersOnline.map((obj) => ({ _id: obj._id, owner: obj.owner.toString() }));
    const distinctOwners = result.reduce((acc, { owner }) => {
      acc[owner] = (acc[owner] || 0) + 1;
      return acc;
    }, {});

    const uniqueUsersOnline = Object.keys(distinctOwners).length;

    if (uniqueUsersOnline > USER_CONTROL_ONLINE.MAX_NUMBER_OF_PLAYERS) {
      throw new BadRequestError("Sorry, max number of online players reached. Please try again in a few minutes.");
    }

    const { accessToken, refreshToken } = await user.generateAccessToken();

    await this.analyticsHelper.updateUserInfo(user);

    await this.analyticsHelper.track("UserLogin", user);

    return {
      accessToken,
      refreshToken,
    };
  }
}
