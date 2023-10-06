import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { TrackClassExecutionTime } from "@jonit-dev/decorators-utils";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CLASS_BONUS_OR_PENALTIES } from "@providers/constants/SkillConstants";
import { CharacterClass } from "@rpg-engine/shared";
import {
  IBasicAttributesBonusAndPenalties,
  ICombatSkillsBonusAndPenalties,
  ICraftingSkillsBonusAndPenalties,
} from "@rpg-engine/shared/dist/types/skills.types";
import { provide } from "inversify-binding-decorators";

@TrackClassExecutionTime()
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

  @TrackNewRelicTransaction()
  public async getClassBonusOrPenaltiesBuffs(characterId: string): Promise<Record<string, number>> {
    const character = await Character.findById(characterId).lean({ virtuals: true, defaults: true }).select("class");

    if (!character) {
      throw new Error(`Character not found: ${characterId}`);
    }

    const classBonusPenalties = this.getClassBonusOrPenalties(character.class as CharacterClass);

    return this.parseBonusAndPenalties(classBonusPenalties);
  }

  private parseBonusAndPenalties(bonusAndPenalties: Record<string, any>): Record<string, number> {
    let result = {};

    for (const [, value] of Object.entries(bonusAndPenalties)) {
      result = {
        ...result,
        ...value,
      };
    }

    for (const [key, value] of Object.entries(result) as any) {
      result[key] = value * 100;
    }

    return result;
  }
}
