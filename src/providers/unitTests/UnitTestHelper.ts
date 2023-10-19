import { IUser, User } from "@entities/ModuleSystem/UserModel";

import { provide } from "inversify-binding-decorators";

import { userMock } from "./mock/userMock";

@provide(UnitTestHelper)
export class UnitTestHelper {
  constructor() {}

  public async createMockUser(extraProps?: Partial<IUser>): Promise<IUser> {
    const newUser = new User({
      ...userMock,
      ...extraProps,
    });

    await newUser.save();

    return newUser;
  }
}
