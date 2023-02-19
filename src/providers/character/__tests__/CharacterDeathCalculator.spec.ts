import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { container } from "@providers/inversify/container";
import { CharacterDeathCalculator } from "../CharacterDeathCalculator";

describe("CharacterDeathCalculator", () => {
  let characterDeathCalculator: CharacterDeathCalculator;

  beforeAll(() => {
    characterDeathCalculator = container.get(CharacterDeathCalculator);
  });

  it("calculates correctly the drop chances", () => {
    const dropChance7 = characterDeathCalculator.calculateInventoryDropChance({
      level: 7,
    } as unknown as ISkill);

    expect(dropChance7).toBe(5);

    const dropChance12 = characterDeathCalculator.calculateInventoryDropChance({
      level: 12,
    } as unknown as ISkill);

    expect(dropChance12).toBe(15);

    const dropChance17 = characterDeathCalculator.calculateInventoryDropChance({
      level: 17,
    } as unknown as ISkill);

    expect(dropChance17).toBe(35);
  });

  it("calculates correctly the drop chances for over max thereshold", () => {
    const dropChance = characterDeathCalculator.calculateInventoryDropChance({
      level: 50,
    } as unknown as ISkill);

    expect(dropChance).toBe(100);
    const dropChance2 = characterDeathCalculator.calculateInventoryDropChance({
      level: 32,
    } as unknown as ISkill);

    expect(dropChance2).toBe(100);
  });
});
