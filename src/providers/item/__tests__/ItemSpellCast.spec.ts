import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { container, unitTestHelper } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ItemSpellCast } from "../ItemSpellCast";

describe("ItemSpellCast.ts", () => {
  let itemSpellCast: ItemSpellCast;
  let testCharacter: ICharacter;
  let sendEventToUser: jest.SpyInstance;
  let animationEventMock: jest.SpyInstance;

  beforeAll(async () => {
    await unitTestHelper.beforeAllJestHook();

    itemSpellCast = container.get<ItemSpellCast>(ItemSpellCast);
  });

  beforeEach(async () => {
    await unitTestHelper.beforeEachJestHook(true);

    testCharacter = await (
      await unitTestHelper.createMockCharacter(
        { health: 50 },
        { hasEquipment: false, hasInventory: false, hasSkills: true }
      )
    )
      .populate("skills")
      .execPopulate();

    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");

    // animationEventMock = jest.spyOn(AnimationEffect.prototype, "sendAnimationEvent");
    // animationEventMock.mockImplementation();
  });

  afterEach(() => {
    sendEventToUser.mockRestore();
    // animationEventMock.mockRestore();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await unitTestHelper.afterAllJestHook();
  });

  describe("verify message is a spell being cast", () => {
    it("should be self healing spell casting", () => {
      expect(itemSpellCast.isSpellCasting("heal me now")).toBeTruthy();
    });

    it("should not be self healing spell casting", () => {
      expect(itemSpellCast.isSpellCasting("heal me now ")).toBeFalsy();
    });
  });
});
