import { RACE_BONUS_OR_PENALTIES } from "@providers/constants/SkillConstants";
import { LifeBringerRaces, ShadowWalkerRaces } from "@rpg-engine/shared";
import {
  IBasicAttributesBonusAndPenalties,
  ICombatSkillsBonusAndPenalties,
  ICraftingSkillsBonusAndPenalties,
} from "@rpg-engine/shared/dist/types/skills.types";
import { provide } from "inversify-binding-decorators";

@provide(CharacterRaceBonusOrPenalties)
export class CharacterRaceBonusOrPenalties {
  constructor() {}

  public getRaceBonusOrPenaltises(characterRace: ShadowWalkerRaces | LifeBringerRaces): {
    basicAttributes: IBasicAttributesBonusAndPenalties;
    combatSkills: ICombatSkillsBonusAndPenalties;
    craftingSkills: ICraftingSkillsBonusAndPenalties;
  } {
    const foundRace = RACE_BONUS_OR_PENALTIES.find((data) => data.race === characterRace);

    if (!foundRace) {
      throw new Error(`Invalid Race: ${characterRace}`);
    }
    return {
      basicAttributes: foundRace.basicAttributes,
      combatSkills: foundRace.combatSkills,
      craftingSkills: foundRace.craftingSkills,
    };
  }
}
