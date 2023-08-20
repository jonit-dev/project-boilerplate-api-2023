import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { provide } from "inversify-binding-decorators";

@provide(CharacterDeathCalculator)
export class CharacterDeathCalculator {
  public calculateSkillLoss(skills: ISkill, multiply = 1): number {
    // Define the XP/SP loss based on character level
    const skillLossPercentageLevel = {
      5: 0,
      8: 2,
      10: 3,
      12: 4,
      14: 5,
      16: 6,
      18: 8,
      20: 10,
    };

    const level = skills.level;

    for (const [threshold, xpLoss] of Object.entries(skillLossPercentageLevel)) {
      if (level <= Number(threshold)) {
        return xpLoss * multiply;
      }
    }

    return 10;
  }

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
