import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterBuffSkill } from "@providers/character/characterBuff/CharacterBuffSkill";
import { SP_INCREASE_RATIO, SP_MAGIC_INCREASE_TIMES_MANA } from "@providers/constants/SkillConstants";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  AnimationEffectKeys,
  IIncreaseSPResult,
  ISkillDetails,
  ISkillEventFromServer,
  IUIShowMessage,
  SkillEventType,
  SkillSocketEvents,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Types } from "mongoose";
import { SkillCalculator } from "./SkillCalculator";

@provide(SkillFunctions)
export class SkillFunctions {
  constructor(
    private skillCalculator: SkillCalculator,
    private animationEffect: AnimationEffect,
    private socketMessaging: SocketMessaging,
    private characterBuffSkill: CharacterBuffSkill
  ) {}

  public async updateSkillByType(
    character: ICharacter,
    skills: ISkill,
    skillName: string,
    bonusOrPenalties: number
  ): Promise<boolean> {
    let skillLevelUp = false;

    const skill = skills[skillName] as ISkillDetails;

    if (bonusOrPenalties > 0 && skill.skillPoints >= 0) skill.skillPoints += bonusOrPenalties;
    if (bonusOrPenalties < 0 && skill.skillPoints > 0) skill.skillPoints -= bonusOrPenalties * -1;

    skill.level = await this.characterBuffSkill.getSkillLevelWithoutBuffs(character, skills, skillName);

    skill.skillPointsToNextLevel = this.skillCalculator.calculateSPToNextLevel(skill.skillPoints, skill.level + 1);

    if (skill.skillPointsToNextLevel <= 0) {
      skillLevelUp = true;
      skill.level++;
      skill.skillPointsToNextLevel = this.skillCalculator.calculateSPToNextLevel(skill.skillPoints, skill.level + 1);
    }

    return skillLevelUp;
  }

  public async calculateBonusOrPenaltiesSP(
    character: ICharacter,
    bonusOrPenalties: number,
    skillLevel: number,
    skillName: string
  ): Promise<number> {
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;

    skillLevel = await this.characterBuffSkill.getSkillLevelWithoutBuffs(character, skills, skillName);

    return Number((skillLevel * (1 + Number(bonusOrPenalties.toFixed(2))) * SP_INCREASE_RATIO).toFixed(2));
  }

  public async calculateBonusOrPenaltiesMagicSP(
    character: ICharacter,
    magicBonusOrPenalties: number,
    skillLevel: number,
    skillName: string
  ): Promise<number> {
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;

    skillLevel = await this.characterBuffSkill.getSkillLevelWithoutBuffs(character, skills, skillName);

    return Number(
      (skillLevel * (1 + Number(magicBonusOrPenalties.toFixed(2))) * SP_MAGIC_INCREASE_TIMES_MANA).toFixed(2)
    );
  }

  public async updateSkills(skills: ISkill, character: ICharacter): Promise<void> {
    await Skill.findByIdAndUpdate(skills._id, { ...skills });

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.ReadInfo, {
      skill: skills,
    });
  }

  public async sendSkillLevelUpEvents(
    skillData: IIncreaseSPResult,
    character: ICharacter,
    target?: INPC | ICharacter
  ): Promise<void> {
    let behavior = "";

    if (skillData.skillLevelBefore > skillData.skillLevelAfter) {
      behavior = "regressed";
    } else {
      behavior = "advanced";
    }

    const levelUpEventPayload: ISkillEventFromServer = {
      characterId: character.id,
      targetId: target?.id,
      targetType: target?.type as "Character" | "NPC",
      eventType: SkillEventType.SkillLevelUp,
      level: skillData.skillLevelBefore,
      skill: skillData.skillName,
    };

    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: `You ${behavior} from level ${skillData.skillLevelBefore} to ${
        skillData.skillLevelAfter
      } in ${_.startCase(_.toLower(skillData.skillName))} fighting.`,
      type: "info",
    });

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.SkillGain, levelUpEventPayload);

    await this.animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.SkillLevelUp);
  }

  /**
   * calculateBonus based on skill level
   * @param skillLevel
   * @returns
   */
  public async calculateBonus(skillsId: undefined | Types.ObjectId): Promise<number> {
    if (!skillsId) {
      return 0;
    }
    const skills = await Skill.findById(skillsId);
    if (!skills) {
      return 0;
    }
    return Number(((skills.level - 1) / 50).toFixed(2));
  }
}
