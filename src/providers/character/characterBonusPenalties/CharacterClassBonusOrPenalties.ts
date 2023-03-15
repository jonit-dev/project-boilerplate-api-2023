import { CLASS_BONUS_OR_PENALTIES } from "@providers/constants/SkillConstants";
import { CharacterClass } from "@rpg-engine/shared";
import {
  IBasicAttributesBonusAndPenalties,
  ICombatSkillsBonusAndPenalties,
  ICraftingSkillsBonusAndPenalties,
} from "@rpg-engine/shared/dist/types/skills.types";
import { provide } from "inversify-binding-decorators";

@provide(CharacterClassBonusOrPenalties)
export class CharacterClassBonusOrPenalties {
  constructor() {}

  public getClassBonusOrPenalties(characterClass: CharacterClass): {
    basicAttributes: IBasicAttributesBonusAndPenalties;
    combatSkills: ICombatSkillsBonusAndPenalties;
    craftingSkills: ICraftingSkillsBonusAndPenalties;
  } {
    const foundClass = CLASS_BONUS_OR_PENALTIES.find((data) => data.class === characterClass);

    if (!foundClass) {
      throw new Error(`Invalid Class: ${characterClass}`);
    }
    return {
      basicAttributes: foundClass.basicAttributes,
      combatSkills: foundClass.combatSkills,
      craftingSkills: foundClass.craftingSkills,
    };
  }
}
