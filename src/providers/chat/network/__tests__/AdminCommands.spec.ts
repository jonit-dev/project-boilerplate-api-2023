import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container, unitTestHelper } from "@providers/inversify/container";
import { ToGridX, ToGridY } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { AdminCommands } from "../AdminCommands";
describe("AdminCommands", () => {
  let adminCommands: AdminCommands;
  let testCharacter: ICharacter;

  let sendMessageToCharacterSpy: jest.SpyInstance;

  beforeAll(() => {
    adminCommands = container.get(AdminCommands);
  });

  beforeEach(async () => {
    testCharacter = await unitTestHelper.createMockCharacter();

    // @ts-ignore
    sendMessageToCharacterSpy = jest.spyOn(adminCommands.socketMessaging, "sendMessageToCharacter");

    jest.clearAllMocks();
  });

  describe("Banning", () => {
    it("properly bans a character", async () => {
      await adminCommands.handleBanCommand([testCharacter.name, "10"], testCharacter);

      const updatedCharacter = (await Character.findById(testCharacter._id)
        .lean()
        .select("isBanned banRemovalDate")) as ICharacter;

      const diff = dayjs(updatedCharacter.banRemovalDate).diff(dayjs(), "day") + 1;

      expect(diff).toBe(10);
      expect(updatedCharacter.isBanned).toBe(true);
      expect(sendMessageToCharacterSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: testCharacter._id,
        }),
        "You have been banned for 10 days"
      );
    });
  });

  describe("Teleporting", () => {
    let changeCharacterSceneSpy: jest.SpyInstance;

    beforeAll(() => {
      // @ts-ignore
      changeCharacterSceneSpy = jest.spyOn(adminCommands.mapTransition, "changeCharacterScene");
    });

    it("properly teleports a character", async () => {
      await adminCommands.handleTeleportCommand([testCharacter.name, "1170", "1170", "ilya"], testCharacter);

      expect(changeCharacterSceneSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: testCharacter._id,
        }),
        expect.objectContaining({
          map: "ilya",
          gridX: ToGridX(1170),
          gridY: ToGridY(1170),
        })
      );
    });
  });

  describe("Send to temple", () => {
    it("properly teleports a character to the temple", async () => {
      await adminCommands.handleSendTempleCommand([testCharacter.name], testCharacter);

      const updatedCharacter = (await Character.findById(testCharacter._id).lean().select("x y")) as ICharacter;

      expect(updatedCharacter.x).toBe(testCharacter.initialX);
      expect(updatedCharacter.y).toBe(testCharacter.initialY);
      expect(sendMessageToCharacterSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: testCharacter.name,
        }),
        "Player '" + testCharacter.name + "' has been teleported to the temple"
      );
    });
  });

  describe("Go to player", () => {
    it("teleports the admin to the targeted player's location", async () => {
      const targetPlayer = await unitTestHelper.createMockCharacter();
      await adminCommands.handleGotoCommand([targetPlayer.name], testCharacter);

      const updatedCharacter = (await Character.findById(testCharacter._id).lean().select("x y")) as ICharacter;
      expect(updatedCharacter.x).toBe(targetPlayer.x);
      expect(updatedCharacter.y).toBe(targetPlayer.y);
    });
  });

  describe("Get position", () => {
    it("retrieves the coordinates of the targeted player", async () => {
      const targetPlayer = await unitTestHelper.createMockCharacter();
      await adminCommands.handleGetPosCommand([targetPlayer.name], testCharacter);

      expect(sendMessageToCharacterSpy).toHaveBeenCalledWith(
        testCharacter,
        `Coordinates of player '${targetPlayer.name}': x = ${targetPlayer.x || 0}, y = ${targetPlayer.y || 0}`
      );
    });
  });

  describe("Summon player", () => {
    it("summons the targeted player to the admin's location", async () => {
      const targetPlayer = await unitTestHelper.createMockCharacter();
      await adminCommands.handleSummonCommand([targetPlayer.name], testCharacter);

      const updatedCharacter = (await Character.findById(targetPlayer._id).lean().select("x y")) as ICharacter;
      expect(updatedCharacter.x).toBe(testCharacter.x);
      expect(updatedCharacter.y).toBe(testCharacter.y);
    });
  });

  describe("List online players", () => {
    beforeEach(async () => {
      await Character.deleteMany({});
    });
    it("lists all online players", async () => {
      await unitTestHelper.createMockCharacter({ isOnline: true });
      await unitTestHelper.createMockCharacter({ isOnline: true });
      await adminCommands.handleOnlineCommand(testCharacter);

      expect(sendMessageToCharacterSpy).toHaveBeenCalledWith(
        testCharacter,
        expect.stringContaining("Players online (2):")
      );
    });

    it("handles when no players are online", async () => {
      await adminCommands.handleOnlineCommand(testCharacter);

      expect(sendMessageToCharacterSpy).toHaveBeenCalledWith(testCharacter, "There are no players online");
    });
  });
});
