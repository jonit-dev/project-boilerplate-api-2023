import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterClassBonusOrPenalties } from "@providers/character/characterBonusPenalties/CharacterClassBonusOrPenalties";
import { CharacterBuffTracker } from "@providers/character/characterBuff/CharacterBuffTracker";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
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
    private characterBonusOrPenalties: CharacterClassBonusOrPenalties,
    private inMemoryHashTable: InMemoryHashTable
  ) {}

  @TrackNewRelicTransaction()
  public async getSkillLevelWithBuffs(skills: ISkill, skillName: SkillsAvailable): Promise<number> {
    try {
      if (!skills.owner) {
        throw new Error("Skills owner is undefined");
      }

      const cacheKey = `${skills.owner}-skill-level-with-buff`;
      const hasCache = await this.inMemoryHashTable.has(cacheKey, skillName);

      if (hasCache) {
        return this.inMemoryHashTable.get(cacheKey, skillName) as unknown as number;
      }

      let totalBuffPercentages = 0;
      const ownerStr = skills.owner.toString();

      const buffPromises: Promise<any>[] = [];

      if (skills.ownerType === "Character") {
        buffPromises.push(this.characterBuffTracker.getAllBuffPercentageChanges(ownerStr, skillName as CharacterTrait));
        buffPromises.push(this.characterBonusOrPenalties.getClassBonusOrPenaltiesBuffs(ownerStr));
      }

      const [allBuffPercentageChanges, classBonusPenaltiesBuff] = await Promise.all(buffPromises);

      if (allBuffPercentageChanges) {
        totalBuffPercentages += allBuffPercentageChanges;
      }

      if (classBonusPenaltiesBuff && classBonusPenaltiesBuff[skillName]) {
        totalBuffPercentages += classBonusPenaltiesBuff[skillName];
      }

      let skillLevel = skills[skillName]?.level;

      if (!skillLevel) {
        skills = await Skill.findById(skills._id).lean();
        skillLevel = skills[skillName]?.level;
      }

      const skillValue = skillLevel * (1 + totalBuffPercentages / 100);
      const result = this.numberFormatter.formatNumber(skillValue);

      await this.inMemoryHashTable.set(cacheKey, skillName, result);

      return result;
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
