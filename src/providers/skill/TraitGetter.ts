import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterClassBonusOrPenalties } from "@providers/character/characterBonusPenalties/CharacterClassBonusOrPenalties";
import { CharacterBuffTracker } from "@providers/character/characterBuff/CharacterBuffTracker";
import { NumberFormatter } from "@providers/text/NumberFormatter";
import { CharacterAttributes, CharacterTrait } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { SkillsAvailable } from "./SkillTypes";

//! This class is responsible for getting the traits with the correct buff applied. Do not fetch skill level or char attribute info without this class, otherwise you won't take into account the buffs!

export type Entity = ICharacter | INPC;

@provide(TraitGetter)
export class TraitGetter {
  constructor(
    private characterBuffTracker: CharacterBuffTracker,
    private numberFormatter: NumberFormatter,
    private newRelic: NewRelic,
    private characterBonusOrPenalties: CharacterClassBonusOrPenalties
  ) {}

  @TrackNewRelicTransaction()
  public async getSkillLevelWithBuffs(skills: ISkill, skillName: SkillsAvailable): Promise<number> {
    try {
      if (!skills.owner) {
        throw new Error("Skills owner is undefined");
      }

      let totalBuffPercentages = 0;
      if (skills.ownerType === "Character") {
        totalBuffPercentages = await this.characterBuffTracker.getAllBuffPercentageChanges(
          skills.owner?.toString()!,
          skillName as CharacterTrait
        );

        const classBonusPenaltiesBuff = await this.characterBonusOrPenalties.getClassBonusOrPenaltiesBuffs(
          skills.owner?.toString()!
        );

        totalBuffPercentages += classBonusPenaltiesBuff[skillName] ?? 0;
      }

      let skillLevel = skills?.[skillName]?.level;

      if (!skillLevel) {
        skills = await Skill.findById(skills._id).lean();
      }

      skillLevel = skills?.[skillName]?.level;

      const skillValue = skillLevel + (skillLevel * totalBuffPercentages) / 100;

      return this.numberFormatter.formatNumber(skillValue);
    } catch (error) {
      console.error(error);
    }

    console.error(`Skill level not found for ${skills.owner} skill ${skillName}`);

    return 0;
  }

  @TrackNewRelicTransaction()
  public async getCharacterAttributeWithBuffs(
    character: ICharacter,
    attributeName: CharacterAttributes
  ): Promise<number> {
    const totalTraitSummedBuffs = await this.characterBuffTracker.getAllBuffPercentageChanges(
      character._id,
      attributeName as CharacterTrait
    );

    const baseValue = character[attributeName];

    const traitValue = Number(baseValue + (baseValue * totalTraitSummedBuffs) / 100);

    return this.numberFormatter.formatNumber(traitValue);
  }
}
