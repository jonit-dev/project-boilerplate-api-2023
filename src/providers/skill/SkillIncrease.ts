import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterBonusPenalties } from "@providers/character/CharacterBonusPenalties";
import { CharacterView } from "@providers/character/CharacterView";
import { SP_INCREASE_RATIO, SP_MAGIC_INCREASE_TIMES_MANA } from "@providers/constants/SkillConstants";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SpellLearn } from "@providers/spells/SpellLearn";
import { AnimationEffectKeys, IUIShowMessage, UISocketEvents } from "@rpg-engine/shared";
import { ItemSubType } from "@rpg-engine/shared/dist/types/item.types";
import {
  BasicAttribute,
  IIncreaseSPResult,
  IIncreaseXPResult,
  ISkillDetails,
  ISkillEventFromServer,
  SkillEventType,
  SkillSocketEvents,
  SKILLS_MAP,
} from "@rpg-engine/shared/dist/types/skills.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { SkillCalculator } from "./SkillCalculator";
@provide(SkillIncrease)
export class SkillIncrease {
  constructor(
    private skillCalculator: SkillCalculator,
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private animationEffect: AnimationEffect,
    private spellLearn: SpellLearn,
    private characterBonusPenalties: CharacterBonusPenalties
  ) {}

  /**
   * Calculates the sp gained according to weapons used and the xp gained by a character every time it causes damage in battle.
   * If new skill level is reached, sends the corresponding event to the character
   *
   */
  public async increaseSkillsOnBattle(attacker: ICharacter, target: ICharacter | INPC, damage: number): Promise<void> {
    // Get character skills and equipment to upgrade them
    const skills = await Skill.findById(attacker.skills);
    if (!skills) {
      throw new Error(`skills not found for character ${attacker.id}`);
    }

    const equipment = await Equipment.findById(attacker.equipment);
    if (!equipment) {
      throw new Error(`equipment not found for character ${attacker.id}`);
    }

    const weapon = await attacker.weapon;

    const increasedWeaponSP = this.increaseSP(skills, weapon?.subType || "None");
    const increasedStrengthSP = this.increaseSP(skills, BasicAttribute.Strength);
    await this.updateSkills(skills, attacker);

    await this.characterBonusPenalties.applyRaceBonusPenalties(attacker, weapon?.subType || "None");
    await this.characterBonusPenalties.applyRaceBonusPenalties(attacker, BasicAttribute.Strength);

    // If character strength skill level increased, send level up event
    if (increasedStrengthSP.skillLevelUp && attacker.channelId) {
      await this.sendSkillLevelUpEvents(increasedStrengthSP, attacker, target);
    }

    // If character skill level increased, send level up event specifying the skill that upgraded
    if (increasedWeaponSP.skillLevelUp && attacker.channelId) {
      await this.sendSkillLevelUpEvents(increasedWeaponSP, attacker, target);
    }

    await this.recordXPinBattle(attacker, target, damage);
  }

  public async increaseShieldingSP(character: ICharacter): Promise<void> {
    const skills = (await Skill.findById(character.skills)) as ISkill;
    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }
    const equipment = await Equipment.findById(character.equipment);
    if (!equipment) {
      throw new Error(`equipment not found for character ${character.id}`);
    }

    const rightHandItem = equipment.rightHand ? await Item.findById(equipment.rightHand) : undefined;
    const leftHandItem = equipment.leftHand ? await Item.findById(equipment.leftHand) : undefined;

    let result = {} as IIncreaseSPResult;
    if (rightHandItem?.subType === ItemSubType.Shield) {
      result = this.increaseSP(skills, rightHandItem.subType);
    }

    if (leftHandItem?.subType === ItemSubType.Shield) {
      result = this.increaseSP(skills, leftHandItem.subType);
    }

    // if character does not have a shield, shielding skills are not updated
    if (!_.isEmpty(result)) {
      await this.updateSkills(skills, character);
      if (result.skillLevelUp && character.channelId) {
        await this.sendSkillLevelUpEvents(result, character);
      }

      await this.characterBonusPenalties.applyRaceBonusPenalties(character, rightHandItem!.subType);
      await this.characterBonusPenalties.applyRaceBonusPenalties(character, leftHandItem!.subType);
    }
  }

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

  public async increaseBasicAttributeSP(
    character: ICharacter,
    attribute: BasicAttribute,
    skillPointsCalculator?: Function
  ): Promise<void> {
    const skills = (await Skill.findById(character.skills)) as ISkill;
    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }

    const result = this.increaseSP(skills, attribute, skillPointsCalculator);
    await this.updateSkills(skills, character);

    if (result.skillLevelUp && character.channelId) {
      await this.sendSkillLevelUpEvents(result, character);
    }
  }

  /**
   * This function distributes
   * the xp stored in the xpToRelease array to the corresponding
   * characters and notifies them if leveled up
   */
  public async releaseXP(target: INPC): Promise<void> {
    let levelUp = false;
    let previousLevel = 0;
    // The xp gained is released once the NPC dies.
    // Store the xp in the xpToRelease array
    // before adding the character to the array, check if the character already caused some damage
    while (target.xpToRelease && target.xpToRelease.length) {
      const record = target.xpToRelease.shift();

      // Get attacker character data
      const character = await Character.findById(record!.charId);
      if (!character) {
        // if attacker does not exist anymore
        // call again the function without this record
        return this.releaseXP(target);
      }

      // Get character skills
      const skills = await Skill.findById(character.skills);
      if (!skills) {
        // if attacker skills does not exist anymore
        // call again the function without this record
        return this.releaseXP(target);
      }

      skills.experience += record!.xp!;
      skills.xpToNextLevel = this.skillCalculator.calculateXPToNextLevel(skills.experience, skills.level + 1);

      while (skills.xpToNextLevel <= 0) {
        if (previousLevel === 0) {
          previousLevel = skills.level;
        }
        skills.level++;
        skills.xpToNextLevel = this.skillCalculator.calculateXPToNextLevel(skills.experience, skills.level + 1);
        levelUp = true;
      }

      await this.updateSkills(skills, character);

      if (levelUp) {
        await this.sendExpLevelUpEvents({ level: skills.level, previousLevel, exp: record!.xp! }, character, target);
        setTimeout(async () => {
          await this.spellLearn.learnLatestSkillLevelSpells(character._id, true);
        }, 5000);
      }

      await this.warnCharactersAroundAboutExpGains(character, record!.xp!);
    }

    await target.save();
  }

  private async sendSkillLevelUpEvents(
    skillData: IIncreaseSPResult,
    character: ICharacter,
    target?: INPC | ICharacter
  ): Promise<void> {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: `You advanced from level ${skillData.skillLevel - 1} to ${skillData.skillLevel} in ${_.startCase(
        _.toLower(skillData.skillName)
      )} fighting.`,
      type: "info",
    });

    const levelUpEventPayload: ISkillEventFromServer = {
      characterId: character.id,
      targetId: target?.id,
      targetType: target?.type as "Character" | "NPC",
      eventType: SkillEventType.SkillLevelUp,
      level: skillData.skillLevel,
      skill: skillData.skillName,
    };

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.SkillGain, levelUpEventPayload);

    await this.animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.SkillLevelUp);
  }

  private async sendExpLevelUpEvents(
    expData: IIncreaseXPResult,
    character: ICharacter,
    target: INPC | ICharacter
  ): Promise<void> {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: `You advanced from level ${expData.previousLevel} to level ${expData.level}.`,
      type: "info",
    });

    const payload = {
      characterId: character.id,
      eventType: SkillEventType.LevelUp,
    };

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.SkillGain, payload);
    await this.animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.LevelUp);

    await this.socketMessaging.sendEventToCharactersAroundCharacter(character, SkillSocketEvents.SkillGain, payload);
  }

  private async warnCharactersAroundAboutExpGains(character: ICharacter, exp: number): Promise<void> {
    const levelUpEventPayload: Partial<ISkillEventFromServer> = {
      characterId: character.id,
      exp,
    };

    const nearbyCharacters = await this.characterView.getCharactersInView(character);

    for (const nearbyCharacter of nearbyCharacters) {
      this.socketMessaging.sendEventToUser(
        nearbyCharacter.channelId!,
        SkillSocketEvents.ExperienceGain,
        levelUpEventPayload
      );
    }

    // warn character about his experience gain
    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.ExperienceGain, levelUpEventPayload);

    // refresh skills (lv, xp, xpToNextLevel)
    const skill = await Skill.findById(character.skills);

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.ReadInfo, {
      skill,
    });
  }

  private increaseSP(skills: ISkill, skillKey: string, skillPointsCalculator?: Function): IIncreaseSPResult {
    let skillLevelUp = false;
    const skillToUpdate = SKILLS_MAP.get(skillKey);

    if (!skillToUpdate) {
      throw new Error(`skill not found for item subtype ${skillKey}`);
    }

    if (!skillPointsCalculator) {
      skillPointsCalculator = (skillDetails: ISkillDetails): number => {
        return this.calculateNewSP(skillDetails);
      };
    }

    const updatedSkillDetails = skills[skillToUpdate] as ISkillDetails;
    updatedSkillDetails.skillPoints = skillPointsCalculator(updatedSkillDetails);
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
      skillLevel: updatedSkillDetails.level,
      skillLevelUp,
      skillPoints: updatedSkillDetails.skillPoints,
      skillPointsToNextLevel: updatedSkillDetails.skillPointsToNextLevel,
    };
  }

  private calculateNewSP(skillDetails: ISkillDetails): number {
    return Math.round((skillDetails.skillPoints + SP_INCREASE_RATIO) * 100) / 100;
  }

  /**
   * Calculates the xp gained by a character every time it causes damage in battle
   * In case the target is NPC, it stores the character's xp gained in the xpToRelease array
   */
  private async recordXPinBattle(attacker: ICharacter, target: ICharacter | INPC, damage: number): Promise<void> {
    // For now, only supported increasing XP when target is NPC
    if (target.type === "NPC" && damage > 0) {
      target = target as INPC;

      // Store the xp in the xpToRelease array
      // before adding the character to the array, check if the character already caused some damage
      if (typeof target.xpToRelease !== "undefined") {
        let found = false;
        for (const i in target.xpToRelease) {
          if (target.xpToRelease[i].charId?.toString() === attacker.id) {
            found = true;
            target.xpToRelease[i].xp! += target.xpPerDamage * damage;
            break;
          }
        }
        if (!found) {
          target.xpToRelease.push({ charId: attacker.id, xp: target.xpPerDamage * damage });
        }
      } else {
        target.xpToRelease = [{ charId: attacker.id, xp: target.xpPerDamage * damage }];
      }

      await target.save();
    }
  }

  private async updateSkills(skills: ISkill, character: ICharacter): Promise<void> {
    await skills.save();

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.ReadInfo, {
      skill: skills,
    });
  }

  private getMagicSkillIncreaseCalculator(spellPower: number): Function {
    return ((power: number, skillDetails: ISkillDetails): number => {
      const manaSp = Math.round((power ?? 0) * SP_MAGIC_INCREASE_TIMES_MANA * 100) / 100;
      return this.calculateNewSP(skillDetails) + manaSp;
    }).bind(this, spellPower);
  }
}
