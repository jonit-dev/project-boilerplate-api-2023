import { CharacterLastAction } from "../CharacterLastAction";
import { container } from "@providers/inversify/container";

describe("CharacterLastAction", () => {
  let characterLastAction: CharacterLastAction;

  beforeEach(() => {
    characterLastAction = container.get(CharacterLastAction);
  });

  afterEach(async () => {
    await characterLastAction.clearAllLastActions();
  });

  describe("setLastAction", () => {
    it("should set the last action of character", async () => {
      const characterId = "1";
      const lastAction = "2023-03-22T19:55:00.391Z";
      await characterLastAction.setLastAction(characterId, lastAction);

      expect(await characterLastAction.getLastAction(characterId)).toEqual(lastAction);
    });
  });

  describe("getLastAction", () => {
    it("should return the last action of an user", async () => {
      const characterId = "1";
      const lastAction = "2023-03-22T19:55:00.391Z";
      await characterLastAction.setLastAction(characterId, lastAction);
      const result = await characterLastAction.getLastAction(characterId);

      expect(result).toEqual(lastAction);
    });

    it("should return undefined if character has no last action", async () => {
      const characterId = "2";
      const result = await characterLastAction.getLastAction(characterId);

      expect(result).toBeUndefined();
    });
  });

  describe("clearLastAction", () => {
    it("should clear the last action of character", async () => {
      const characterId = "1";
      const lastAction = "2023-03-22T19:55:00.391Z";
      await characterLastAction.setLastAction(characterId, lastAction);
      await characterLastAction.clearLastAction(characterId);

      expect(await characterLastAction.getLastAction(characterId)).toBeUndefined();
    });
  });

  describe("clearAllLastAction", () => {
    it("should clear the last action of character", async () => {
      const characterId = "1";
      const lastAction = "2023-03-22T19:55:00.391Z";
      await characterLastAction.setLastAction(characterId, lastAction);
      await characterLastAction.clearAllLastActions();

      expect(await characterLastAction.getLastAction(characterId)).toBeUndefined();
    });
  });
});
