import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { CharacterMovementValidation } from "../CharacterMovementValidation";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { UISocketEvents } from "@rpg-engine/shared";

describe("CharacterMovementValidation", () => {
  let characterMovementValidation: CharacterMovementValidation;
  let isStunMock: jest.SpyInstance;
  let sendEventToUser: jest.SpyInstance;

  const mockIsStun = (retValue: boolean): void => {
    isStunMock && isStunMock.mockRestore();
    isStunMock = jest.spyOn(SpecialEffect.prototype, "isStun").mockImplementation(jest.fn().mockReturnValue(retValue));
  };

  beforeEach(() => {
    mockIsStun(false);
    sendEventToUser = jest.spyOn(SocketMessaging.prototype, "sendEventToUser");
  });

  afterEach(() => {
    isStunMock.mockRestore();
    sendEventToUser.mockRestore();
  });

  beforeAll(() => {
    characterMovementValidation = container.get(CharacterMovementValidation);
  });

  describe("isValid", () => {
    it("should return false if the character is too heavy", async () => {
      const character = {
        speed: 0,
      } as ICharacter;
      const isValid = await characterMovementValidation.isValid(character, 0, 0, true);
      expect(isValid).toBe(false);
    });

    it("should return false if the character is moving too fast", async () => {
      const character = {
        speed: 100,
        lastMovement: new Date(),
        movementIntervalMs: 1000,
        save: jest.fn(),
      } as unknown as ICharacter;

      const isValid = await characterMovementValidation.isValid(character, 0, 0, true);
      expect(isValid).toBe(false);
    });

    it("should return false if the character is moving to a solid", async () => {
      const character = {
        speed: 100,
        lastMovement: new Date(new Date().getTime() - 1000),
        movementIntervalMs: 1000,
      } as ICharacter;
      const isSolid = jest.fn().mockReturnValue(true);
      // @ts-ignore
      jest.spyOn(characterMovementValidation.movementHelper, "isSolid").mockImplementation(isSolid);
      const isValid = await characterMovementValidation.isValid(character, 0, 0, true);
      expect(isValid).toBe(false);
    });

    it("should return false if the character is stunned", async () => {
      const character = {
        speed: 100,
        lastMovement: new Date(new Date().getTime() - 1000),
        movementIntervalMs: 1000,
        isOnline: true,
        isAlive: true,
        isBanned: false,
        type: "Fake",
        _id: "fake-id",
        channelId: "fake-channel-id",
      } as ICharacter;

      const isSolid = jest.fn().mockReturnValue(false);
      // @ts-ignore
      jest.spyOn(characterMovementValidation.movementHelper, "isSolid").mockImplementation(isSolid);

      mockIsStun(true);

      const isValid = await characterMovementValidation.isValid(character, 0, 0, true);
      expect(isValid).toBe(false);

      expect(isStunMock).toHaveBeenCalledWith(character._id, character.type);

      expect(sendEventToUser).toHaveBeenLastCalledWith(character.channelId, UISocketEvents.ShowMessage, {
        message: "Sorry, you can't move because you're stunned",
        type: "error",
      });
    });

    it("should return true if the character is moving to a valid position", async () => {
      const character = {
        speed: 100,
        lastMovement: new Date(new Date().getTime() - 1000),
        movementIntervalMs: 1000,
        isOnline: true,
        isAlive: true,
        isBanned: false,
      } as ICharacter;
      const isSolid = jest.fn().mockReturnValue(false);
      // @ts-ignore
      jest.spyOn(characterMovementValidation.movementHelper, "isSolid").mockImplementation(isSolid);
      const isValid = await characterMovementValidation.isValid(character, 0, 0, true);
      expect(isValid).toBe(true);
    });
  });
});
