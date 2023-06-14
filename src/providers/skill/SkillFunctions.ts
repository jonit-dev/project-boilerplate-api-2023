import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterBuffSkill } from "@providers/character/characterBuff/CharacterBuffSkill";
import { SP_INCREASE_RATIO, SP_MAGIC_INCREASE_TIMES_MANA } from "@providers/constants/SkillConstants";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NumberFormatter } from "@providers/text/NumberFormatter";
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
import { SkillBuff } from "./SkillBuff";
import { SkillCalculator } from "./SkillCalculator";

@provide(SkillFunctions)
export class SkillFunctions {
  constructor(
    private skillCalculator: SkillCalculator,
    private animationEffect: AnimationEffect,
    private socketMessaging: SocketMessaging,
    private characterBuffSkill: CharacterBuffSkill,
    private numberFormatter: NumberFormatter,
    private skillBuff: SkillBuff
  ) {}

  public updateSkillByType(skills: ISkill, skillName: string, bonusOrPenalties: number): boolean {
    let skillLevelUp = false;

    const skill = skills[skillName] as ISkillDetails;

    if (bonusOrPenalties > 0 && skill.skillPoints >= 0) skill.skillPoints += bonusOrPenalties;
    if (bonusOrPenalties < 0 && skill.skillPoints > 0) skill.skillPoints -= bonusOrPenalties * -1;

    skill.skillPointsToNextLevel = this.skillCalculator.calculateSPToNextLevel(skill.skillPoints, skill.level + 1);

    if (skill.skillPointsToNextLevel <= 0) {
      skillLevelUp = true;
      skill.level++;
      skill.skillPointsToNextLevel = this.skillCalculator.calculateSPToNextLevel(skill.skillPoints, skill.level + 1);
    }

    return skillLevelUp;
  }

  public calculateBonusOrPenaltiesSP(bonusOrPenalties: number, skillLevel: number): number {
    return Number((skillLevel * (1 + Number(bonusOrPenalties.toFixed(2))) * SP_INCREASE_RATIO).toFixed(2));
  }

  public calculateBonusOrPenaltiesMagicSP(magicBonusOrPenalties: number, skillLevel: number): number {
    return Number(
      (skillLevel * (1 + Number(magicBonusOrPenalties.toFixed(2))) * SP_MAGIC_INCREASE_TIMES_MANA).toFixed(2)
    );
  }

  public async updateSkills(skills: ISkill, character: ICharacter): Promise<void> {
    await Skill.findByIdAndUpdate(skills._id, { ...skills });

    const buffedSkills = await this.skillBuff.getSkillsWithBuff(character);
    const buffs = await this.characterBuffSkill.calculateAllActiveBuffs(character);

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.ReadInfo, {
      skill: buffedSkills,
      buffs,
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
      message: `You ${behavior} from level ${this.numberFormatter.formatNumber(
        skillData.skillLevelBefore
      )} to ${this.numberFormatter.formatNumber(skillData.skillLevelAfter)} in ${_.startCase(
        _.toLower(skillData.skillName)
      )} fighting.`,
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
  public async calculateBonus(character: ICharacter | INPC, skillsId: undefined | Types.ObjectId): Promise<number> {
    if (!skillsId) {
      return 0;
    }
    const skills = (await Skill.findById(skillsId).lean()) as unknown as ISkill;
    if (!skills) {
      return 0;
    }
    return Number(((skills.level - 1) / 50).toFixed(2));
  }
}
