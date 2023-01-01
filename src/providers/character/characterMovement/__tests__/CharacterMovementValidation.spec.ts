import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { CharacterMovementValidation } from "../CharacterMovementValidation";

describe("CharacterMovementValidation", () => {
  let characterMovementValidation: CharacterMovementValidation;

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

    it("should return true if the character is moving to a valid position", async () => {
      const character = {
        speed: 100,
        lastMovement: new Date(new Date().getTime() - 1000),
        movementIntervalMs: 1000,
      } as ICharacter;
      const isSolid = jest.fn().mockReturnValue(false);
      // @ts-ignore
      jest.spyOn(characterMovementValidation.movementHelper, "isSolid").mockImplementation(isSolid);
      const isValid = await characterMovementValidation.isValid(character, 0, 0, true);
      expect(isValid).toBe(true);
    });
  });
});
