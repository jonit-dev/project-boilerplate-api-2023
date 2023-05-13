import { container } from "@providers/inversify/container";
import { ReadFactionSpriteUseCase } from "../ReadFactionSpriteUseCase";

describe("ReadFactionSpriteUseCase", () => {
  let readFactionSpriteUseCase: ReadFactionSpriteUseCase;

  beforeAll(() => {
    readFactionSpriteUseCase = container.get(ReadFactionSpriteUseCase);
  });

  describe("Races x Class sprites", () => {
    it("properly returns a list of textures according to the provided race and class", () => {
      const results = readFactionSpriteUseCase.readAll("Warrior", "Human");

      expect(results).toBeDefined();

      expect(results).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            class: "Warrior",
            race: "Human",
          }),
        ])
      );

      expect(results).not.toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            textureKey: "orc",
          }),
        ])
      );
    });
  });
});
