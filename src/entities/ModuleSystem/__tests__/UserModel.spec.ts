import { User } from "@entities/ModuleSystem/UserModel";
import { unitTestHelper } from "@providers/inversify/container";
import { UserAuthFlow, UserTypes } from "@rpg-engine/shared";
import { IUser } from "../UserModel";

describe("UserModel.ts", () => {
  let testUser: IUser;

  beforeEach(async () => {
    testUser = await unitTestHelper.createMockUser();
  });

  it("Validate if the record is being created", () => {
    const user = {
      _id: testUser._id,
      name: "User Mock Test",
      role: UserTypes.Regular,
      authFlow: UserAuthFlow.Basic,
      email: "user-mock@test.com",
      address: "mock street",
      phone: "12355679895",
      unsubscribed: false,
      isLoggedIn: true,
      token: "asdad",
      wallet: {
        publicAddress: "public address",
        networkId: 1234,
      },
      characters: [],
    };

    expect(user).toBeDefined();

    expect(user._id).toEqual(testUser._id);
    expect(user.name).toEqual(testUser.name);
    expect(user.role).toEqual(testUser.role);
    expect(user.authFlow).toEqual(testUser.authFlow);
    expect(user.email).toEqual(testUser.email);
    expect(user.address).toEqual(testUser.address);
    expect(user.phone).toEqual(testUser.phone);
  });

  it("should return true if user with email exists and email is case insensitive", async () => {
    // case sensitive
    const result1 = await User.checkIfExists("user-mock@test.com");
    expect(result1).toBe(true);

    // case insensitive
    const result2 = await User.checkIfExists("User-Mock@test.com");
    expect(result2).toBe(true);
  });

  it("should return false if user with email does not exists", async () => {
    const result = await User.checkIfExists("invalid@email.com");
    expect(result).toBe(false);
  });
});
