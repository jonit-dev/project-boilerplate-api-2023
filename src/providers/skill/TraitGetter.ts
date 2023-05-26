import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterBuffTracker } from "@providers/character/characterBuff/CharacterBuffTracker";
import { NumberFormatter } from "@providers/text/NumberFormatter";
import { CharacterAttributes, CharacterTrait } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { SkillsAvailable } from "./SkillTypes";

//! This class is responsible for getting the traits with the correct buff applied. Do not fetch skill level or char attribute info without this class, otherwise you won't take into account the buffs!

export type Entity = ICharacter | INPC;

@provide(TraitGetter)
export class TraitGetter {
  constructor(private characterBuffTracker: CharacterBuffTracker, private numberFormatter: NumberFormatter) {}

  public async getSkillLevelWithBuffs(skills: ISkill, skillName: SkillsAvailable): Promise<number> {
    let totalTraitSummedBuffs = 0;
    if (skills.ownerType === "Character") {
      const entity = (await Character.findById(skills.owner).lean()) as ICharacter;

      totalTraitSummedBuffs = await this.characterBuffTracker.getAllBuffAbsoluteChanges(
        entity,
        skillName as CharacterTrait
      );
    }

    const skillValue = skills[skillName].level + totalTraitSummedBuffs;

    return this.numberFormatter.formatNumber(skillValue);
  }

  public async getCharacterAttributeWithBuffs(
    character: ICharacter,
    attributeName: CharacterAttributes
  ): Promise<number> {
    const totalTraitSummedBuffs = await this.characterBuffTracker.getAllBuffAbsoluteChanges(
      character,
      attributeName as CharacterTrait
    );

    const baseValue = character[attributeName];

    const traitValue = Number(baseValue + totalTraitSummedBuffs);

    return this.numberFormatter.formatNumber(traitValue);
  }
}
