import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { SP_INCREASE_RATIO } from "@providers/constants/SkillConstants";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  AnimationEffectKeys,
  IIncreaseSPResult,
  ISkillDetails,
  ISkillEventFromServer,
  IUIShowMessage,
  SkillEventType,
  SkillSocketEvents,
  SKILLS_MAP,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { SkillCalculator } from "./SkillCalculator";

@provide(SkillFunctions)
export class SkillFunctions {
  constructor(
    private skillCalculator: SkillCalculator,
    private animationEffect: AnimationEffect,
    private socketMessaging: SocketMessaging
  ) {}

  public updateSkillByType(skills: ISkill, skillType: string, bonusOrPenalties: number): boolean {
    let skillLevelUp = false;
    const skillToUpdate = SKILLS_MAP.get(skillType);

    if (!skillToUpdate) {
      throw new Error(`skill not found for item subtype ${skillType}`);
    }

    const skill = skills[skillToUpdate] as ISkillDetails;

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

  public calculateBonusOrPenaltiesSP(bonusOrPenalties: number): number {
    return SP_INCREASE_RATIO * bonusOrPenalties;
  }

  public calculateBonusOrPenaltiesMagicSP(magicBonusOrPenalties: number): number {
    return (magicBonusOrPenalties / 10) * 3;
  }

  public async updateSkills(skills: ISkill, character: ICharacter): Promise<void> {
    await skills.save();

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.ReadInfo, {
      skill: skills.toObject(),
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
}
