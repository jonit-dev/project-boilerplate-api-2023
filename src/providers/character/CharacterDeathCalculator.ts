import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { provide } from "inversify-binding-decorators";

@provide(CharacterDeathCalculator)
export class CharacterDeathCalculator {
  public calculateInventoryDropChance(skills: ISkill): number {
    // Define the chances of dropping inventory based on character level
    const chancesByLevel = {
      5: 0,
      8: 5,
      10: 10,
      12: 15,
      14: 20,
      16: 25,
      18: 35,
      20: 45,
      22: 55,
      24: 65,
      26: 75,
      28: 85,
      30: 95,
      32: 100,
    };

    // Get the character's level
    const level = skills.level;

    for (const [threshold, chance] of Object.entries(chancesByLevel)) {
      // Return the chance of dropping inventory if the character's level is below the current threshold
      if (level <= Number(threshold)) {
        return chance;
      }
    }

    // Return the maximum chance of dropping inventory if the character's level is above the highest threshold
    return 100;
  }
}
