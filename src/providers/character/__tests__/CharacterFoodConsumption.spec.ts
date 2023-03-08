import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { CharacterFoodConsumption } from "../CharacterFoodConsumption";

describe("CharacterFoodConsumption", () => {
  let characterFoodConsumption: CharacterFoodConsumption;

  beforeAll(() => {
    characterFoodConsumption = container.get(CharacterFoodConsumption);

    jest.useFakeTimers({
      advanceTimers: true,
    });
  });

  afterEach(async () => {
    await characterFoodConsumption.clearAllFoodConsumption();
  });

  it("should consume food if its not full", async () => {
    // Arrange
    const character = { _id: "testCharacterId" } as ICharacter;

    // Act
    const result = await characterFoodConsumption.tryConsumingFood(character);

    // Assert
    expect(result).toBe(true);
  });

  it("should block food consumption if its full", async () => {
    // Arrange
    const character = { _id: "testCharacterId" } as ICharacter;
    await characterFoodConsumption.clearAllFoodConsumption();
    // @ts-ignore
    await characterFoodConsumption.consumeFood(character._id);
    // @ts-ignore
    await characterFoodConsumption.consumeFood(character._id);
    // @ts-ignore
    await characterFoodConsumption.consumeFood(character._id);

    // Act
    const result = await characterFoodConsumption.tryConsumingFood(character);

    // Assert
    expect(result).toBe(false);
  });
});
