import { IUser, User } from "@entities/ModuleSystem/UserModel";
import { AnalyticsHelper } from "@providers/analytics/AnalyticsHelper";
import { NotFoundError } from "@providers/errors/NotFoundError";
import { FullCRUD } from "@providers/mongoDB/FullCRUD";
import { TS } from "@providers/translation/TranslationHelper";
import { provide } from "inversify-binding-decorators";

import { IUserRepository } from "./IUserRepository";

@provide(UserRepository)
export class UserRepository extends FullCRUD implements IUserRepository {
  constructor(private analyticsHelper: AnalyticsHelper) {
    super(analyticsHelper);
  }

  public async signUp(newUserData: any): Promise<IUser> {
    //! Note: password is hashed on pre("save") method from userSchema
    const newUser = new User({ ...newUserData });

    await newUser.save();

    await this.analyticsHelper.track("UserRegister", newUser);

    await this.analyticsHelper.updateUserInfo(newUser);

    return newUser;
  }

  public async findUser(params: object): Promise<IUser> {
    const user = await User.findOne(params);

    if (!user) {
      throw new NotFoundError(TS.translate("users", "userNotFound"));
    }

    return user;
  }
}
