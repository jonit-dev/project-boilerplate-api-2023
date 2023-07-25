import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import { CharacterBonusPenalties } from "@providers/character/characterBonusPenalties/CharacterBonusPenalties";
import { CharacterWeight } from "@providers/character/weight/CharacterWeight";
import {
  SP_CRAFTING_INCREASE_RATIO,
  SP_INCREASE_RATIO,
  SP_MAGIC_INCREASE_TIMES_MANA,
} from "@providers/constants/SkillConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { NPCExperience } from "@providers/npc/NPCExperience/NPCExperience";
import { NumberFormatter } from "@providers/text/NumberFormatter";
import { ItemSubType } from "@rpg-engine/shared/dist/types/item.types";
import {
  BasicAttribute,
  IIncreaseSPResult,
  ISkillDetails,
  SKILLS_MAP,
} from "@rpg-engine/shared/dist/types/skills.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { SkillCalculator } from "./SkillCalculator";
import { SkillCraftingMapper } from "./SkillCraftingMapper";
import { SkillFunctions } from "./SkillFunctions";
import { SkillGainValidation } from "./SkillGainValidation";
import { CraftingSkillsMap } from "./constants";

@provide(SkillIncrease)
export class SkillIncrease {
  constructor(
    private skillCalculator: SkillCalculator,
    private characterBonusPenalties: CharacterBonusPenalties,
    private skillFunctions: SkillFunctions,
    private skillGainValidation: SkillGainValidation,
    private characterWeapon: CharacterWeapon,
    private inMemoryHashTable: InMemoryHashTable,
    private characterWeight: CharacterWeight,
    private skillMapper: SkillCraftingMapper,
    private numberFormatter: NumberFormatter,
    private npcExperience: NPCExperience
  ) {}

  /**
   * Calculates the sp gained according to weapons used and the xp gained by a character every time it causes damage in battle.
   * If new skill level is reached, sends the corresponding event to the character
   *
   */
  @TrackNewRelicTransaction()
  public async increaseSkillsOnBattle(attacker: ICharacter, target: ICharacter | INPC, damage: number): Promise<void> {
    const skills = await this.fetchCharacterSkills(attacker);

    const weapon = await this.characterWeapon.getWeapon(attacker);
    const weaponSubType = weapon?.item ? weapon?.item.subType || "None" : "None";
    const skillName = SKILLS_MAP.get(weaponSubType);

    if (!skillName) {
      throw new Error(`Skill not found for weapon ${weaponSubType}`);
    }

    await this.npcExperience.recordXPinBattle(attacker, target, damage);

    const canIncreaseSP = this.skillGainValidation.canUpdateSkills(attacker, skills, skillName);
    if (!canIncreaseSP) return;

    const targetSkills = target.skills as ISkill;

    const increasedWeaponSP = this.increaseSP(
      skills,
      weaponSubType,
      undefined,
      SKILLS_MAP,
      this.skillFunctions.calculateBonus(targetSkills?.level)
    );

    let increasedStrengthSP;
    if (weaponSubType !== ItemSubType.Magic && weaponSubType !== ItemSubType.Staff) {
      increasedStrengthSP = this.increaseSP(skills, BasicAttribute.Strength);
    }

    await this.skillFunctions.updateSkills(skills, attacker);
    await this.characterBonusPenalties.applyRaceBonusPenalties(attacker, weaponSubType);

    if (weaponSubType !== ItemSubType.Magic && weaponSubType !== ItemSubType.Staff) {
      await this.characterBonusPenalties.applyRaceBonusPenalties(attacker, BasicAttribute.Strength);
    }

    if (increasedStrengthSP?.skillLevelUp && attacker.channelId) {
      await this.skillFunctions.sendSkillLevelUpEvents(increasedStrengthSP, attacker, target);
      await this.characterWeight.updateCharacterWeight(attacker);
    }

    if (increasedWeaponSP?.skillLevelUp && attacker.channelId) {
      await this.skillFunctions.sendSkillLevelUpEvents(increasedWeaponSP, attacker, target);
    }
  }

  @TrackNewRelicTransaction()
  public async increaseShieldingSP(character: ICharacter): Promise<void> {
    const hasShield = await this.characterWeapon.hasShield(character);

    if (!hasShield) {
      return;
    }

    let skills = character.skills as ISkill;

    if (!skills.level) {
      skills = await this.fetchCharacterSkills(character);
    }

    if (!character) {
      throw new Error("character not found");
    }
    const canIncreaseSP = this.skillGainValidation.canUpdateSkills(character, skills as ISkill, "shielding");

    if (!canIncreaseSP) {
      return;
    }

    const result = this.increaseSP(skills, ItemSubType.Shield) as IIncreaseSPResult;

    await this.skillFunctions.updateSkills(skills, character);

    if (!_.isEmpty(result)) {
      if (result.skillLevelUp && character.channelId) {
        await this.skillFunctions.sendSkillLevelUpEvents(result, character);
      }

      await this.characterBonusPenalties.applyRaceBonusPenalties(character, ItemSubType.Shield);
    }
  }

  @TrackNewRelicTransaction()
  public async increaseMagicSP(character: ICharacter, power: number): Promise<void> {
    await this.increaseBasicAttributeSP(character, BasicAttribute.Magic, this.getMagicSkillIncreaseCalculator(power));
  }

  public async increaseMagicResistanceSP(character: ICharacter, power: number): Promise<void> {
    await this.increaseBasicAttributeSP(
      character,
      BasicAttribute.MagicResistance,
      this.getMagicSkillIncreaseCalculator(power)
    );
  }

  @TrackNewRelicTransaction()
  public async increaseBasicAttributeSP(
    character: ICharacter,
    attribute: BasicAttribute,
    skillPointsCalculator?: Function
  ): Promise<void> {
    const skills = await this.fetchCharacterSkills(character);

    const canIncreaseSP = this.skillGainValidation.canUpdateSkills(character, skills as ISkill, attribute);

    if (!canIncreaseSP) {
      return;
    }

    const result = this.increaseSP(skills, attribute, skillPointsCalculator);
    await this.skillFunctions.updateSkills(skills, character);

    if (result.skillLevelUp && character.channelId) {
      // If BasicAttribute(except dexterity) level up we clean the data from Redis
      if (attribute !== BasicAttribute.Dexterity && skills.owner) {
        await this.inMemoryHashTable.delete(skills.owner.toString(), "totalAttack");
        await this.inMemoryHashTable.delete(skills.owner.toString(), "totalDefense");
      }

      await this.skillFunctions.sendSkillLevelUpEvents(result, character);
    }

    await this.characterBonusPenalties.applyRaceBonusPenalties(character, attribute);
  }

  public async increaseCraftingSP(character: ICharacter, craftedItemKey: string): Promise<void> {
    const skillToUpdate = this.skillMapper.getCraftingSkillToUpdate(craftedItemKey);

    if (!skillToUpdate) {
      throw new Error(`skill not found for item ${craftedItemKey}`);
    }

    const skills = (await Skill.findById(character.skills)) as unknown as ISkill;
    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }

    const canIncreaseSP = this.skillGainValidation.canUpdateSkills(character, skills as ISkill, skillToUpdate);

    if (!canIncreaseSP) {
      return;
    }

    const craftSkillPointsCalculator = (skillDetails: ISkillDetails): number => {
      return this.calculateNewCraftSP(skillDetails);
    };

    const result = this.increaseSP(skills, craftedItemKey, craftSkillPointsCalculator, CraftingSkillsMap);
    await this.skillFunctions.updateSkills(skills, character);

    await this.characterBonusPenalties.applyRaceBonusPenalties(character, skillToUpdate);

    if (result.skillLevelUp && character.channelId) {
      await this.skillFunctions.sendSkillLevelUpEvents(result, character);
    }
  }

  private async fetchCharacterSkills(character: ICharacter): Promise<ISkill> {
    const skills = (await Skill.findById(character.skills)
      .lean({ virtuals: true, defaults: true })
      .cacheQuery({ cacheKey: `${character._id}-skills` })) as unknown as ISkill;

    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }

    return skills;
  }

  private increaseSP(
    skills: ISkill,
    skillKey: string,
    skillPointsCalculator?: Function,
    skillsMap: Map<string, string> = SKILLS_MAP,
    bonus?: number
  ): IIncreaseSPResult {
    let skillLevelUp = false;
    const skillToUpdate = skillsMap.get(skillKey) ?? this.skillMapper.getCraftingSkillToUpdate(skillKey);

    if (!skillToUpdate) {
      throw new Error(`skill not found for item subtype ${skillKey}`);
    }

    if (!skillPointsCalculator) {
      skillPointsCalculator = (skillDetails: ISkillDetails, bonus?: number): number => {
        return this.calculateNewSP(skillDetails, bonus);
      };
    }

    const updatedSkillDetails = skills[skillToUpdate] as ISkillDetails;

    updatedSkillDetails.skillPoints = skillPointsCalculator(updatedSkillDetails, bonus);
    updatedSkillDetails.skillPointsToNextLevel = this.skillCalculator.calculateSPToNextLevel(
      updatedSkillDetails.skillPoints,
      updatedSkillDetails.level + 1
    );

    if (updatedSkillDetails.skillPointsToNextLevel <= 0) {
      skillLevelUp = true;

      updatedSkillDetails.level++;

      updatedSkillDetails.skillPointsToNextLevel = this.skillCalculator.calculateSPToNextLevel(
        updatedSkillDetails.skillPoints,
        updatedSkillDetails.level + 1
      );
    }

    skills[skillToUpdate] = updatedSkillDetails;

    return {
      skillName: skillToUpdate,
      skillLevelBefore: this.numberFormatter.formatNumber(updatedSkillDetails.level - 1),
      skillLevelAfter: this.numberFormatter.formatNumber(updatedSkillDetails.level),
      skillLevelUp,
      skillPoints: Math.round(updatedSkillDetails.skillPoints),
      skillPointsToNextLevel: Math.round(updatedSkillDetails.skillPointsToNextLevel),
    };
  }

  private calculateNewSP(skillDetails: ISkillDetails, bonus?: number): number {
    let spIncreaseRatio = SP_INCREASE_RATIO;
    if (typeof bonus === "number") {
      spIncreaseRatio += bonus;
    }
    return Math.round((skillDetails.skillPoints + spIncreaseRatio) * 100) / 100;
  }

  private calculateNewCraftSP(skillDetails: ISkillDetails): number {
    return Math.round((skillDetails.skillPoints + SP_CRAFTING_INCREASE_RATIO) * 100) / 100;
  }

  private getMagicSkillIncreaseCalculator(spellPower: number): Function {
    return ((power: number, skillDetails: ISkillDetails): number => {
      const manaSp = Math.round((power ?? 0) * SP_MAGIC_INCREASE_TIMES_MANA * 100) / 100;
      return this.calculateNewSP(skillDetails) + manaSp;
    }).bind(this, spellPower);
  }
}
