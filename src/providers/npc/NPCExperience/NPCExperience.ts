import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterView } from "@providers/character/CharacterView";
import { CharacterBuffSkill } from "@providers/character/characterBuff/CharacterBuffSkill";
import { NPC_GIANT_FORM_EXPERIENCE_MULTIPLIER } from "@providers/constants/NPCConstants";
import { spellLearn } from "@providers/inversify/container";
import { SkillBuff } from "@providers/skill/SkillBuff";
import { SkillCalculator } from "@providers/skill/SkillCalculator";
import { SkillFunctions } from "@providers/skill/SkillFunctions";
import { SkillStatsIncrease } from "@providers/skill/SkillStatsIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NumberFormatter } from "@providers/text/NumberFormatter";
import { Time } from "@providers/time/Time";
import {
  AnimationEffectKeys,
  DisplayTextSocketEvents,
  IDisplayTextEvent,
  IIncreaseXPResult,
  IUIShowMessage,
  SkillEventType,
  SkillSocketEvents,
  UISocketEvents,
} from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";

import random from "lodash/random";
import uniqBy from "lodash/uniqBy";
import { clearCacheForKey } from "speedgoose";
import { v4 as uuidv4 } from "uuid";
@provide(NPCExperience)
export class NPCExperience {
  constructor(
    private skillCalculator: SkillCalculator,
    private skillFunctions: SkillFunctions,
    private socketMessaging: SocketMessaging,
    private numberFormatter: NumberFormatter,
    private characterBuffSkill: CharacterBuffSkill,
    private skillBuff: SkillBuff,
    private characterView: CharacterView,
    private animationEffect: AnimationEffect,
    private time: Time,
    private skillLvUpStatsIncrease: SkillStatsIncrease
  ) {}

  /**
   * This function distributes
   * the xp stored in the xpToRelease array to the corresponding
   * characters and notifies them if leveled up
   */
  public async releaseXP(target: INPC): Promise<void> {
    await this.time.waitForMilliseconds(random(0, 200)); // add artificial delay to avoid concurrency

    // refresh target in case it was updated in the meantime
    const { xpReleased, xpReleasing } = (await NPC.findById(target._id)
      .lean()
      .select("xpToRelease xpReleasing health")) as INPC;

    if (xpReleased || xpReleasing) {
      // clean up xpToRelease array
      await NPC.updateOne({ _id: target._id }, { xpToRelease: [] });

      // if target is still alive, or XP is already released, or XP is currently being released, then return
      return;
    }

    await NPC.updateOne({ _id: target._id }, { xpReleasing: true });

    let levelUp = false;
    let previousLevel = 0;
    // The xp gained is released once the NPC dies.
    // Store the xp in the xpToRelease array
    // before adding the character to the array, check if the character already caused some damage

    target.xpToRelease = uniqBy(target.xpToRelease, "xpId");

    while (target.xpToRelease && target.xpToRelease.length) {
      const record = target.xpToRelease.shift();

      // Get attacker character data
      const character = (await Character.findById(record!.charId).lean({
        virtuals: true,
        defaults: true,
      })) as ICharacter;

      if (!character) {
        // if attacker does not exist anymore
        // call again the function without this record
        return this.releaseXP(target);
      }

      await clearCacheForKey(`characterBuffs_${character._id}`);
      await clearCacheForKey(`${character._id}-skills`);

      // Get character skills
      const skills = (await Skill.findById(character.skills)
        .lean()
        .cacheQuery({
          cacheKey: `${character?._id}-skills`,
        })) as ISkill;

      if (!skills) {
        // if attacker skills does not exist anymore
        // call again the function without this record
        return this.releaseXP(target);
      }

      const exp = record!.xp! * (target.isGiantForm ? NPC_GIANT_FORM_EXPERIENCE_MULTIPLIER : 1);

      skills.experience += exp;
      skills.xpToNextLevel = this.skillCalculator.calculateXPToNextLevel(skills.experience, skills.level + 1);

      while (skills.xpToNextLevel <= 0) {
        if (previousLevel === 0) {
          previousLevel = skills.level;
        }
        skills.level++;
        skills.xpToNextLevel = this.skillCalculator.calculateXPToNextLevel(skills.experience, skills.level + 1);
        levelUp = true;
      }

      await this.skillFunctions.updateSkills(skills, character);

      if (levelUp) {
        await this.skillLvUpStatsIncrease.increaseMaxManaMaxHealth(character._id);

        await this.sendExpLevelUpEvents({ level: skills.level, previousLevel, exp }, character, target);
        setTimeout(async () => {
          // importing directly to avoid circular dependency issues. Good luck trying to solve.
          await spellLearn.learnLatestSkillLevelSpells(character._id, true);
        }, 5000);
      }

      await this.warnCharactersAroundAboutExpGains(character, exp);
    }

    await NPC.updateOne({ _id: target._id }, { xpToRelease: target.xpToRelease, xpReleased: true });
  }

  /**
   * Calculates the xp gained by a character every time it causes damage in battle
   * In case the target is NPC, it stores the character's xp gained in the xpToRelease array
   */
  public async recordXPinBattle(attacker: ICharacter, target: ICharacter | INPC, damage: number): Promise<void> {
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

            const multiplier = damage > target["healthBeforeHit"] ? target["healthBeforeHit"] : damage;

            target.xpToRelease[i].xp! += target.xpPerDamage * multiplier;
            break;
          }
        }
        if (!found) {
          target.xpToRelease.push({ xpId: uuidv4(), charId: attacker.id, xp: target.xpPerDamage * damage });
        }
      } else {
        target.xpToRelease = [{ xpId: uuidv4(), charId: attacker.id, xp: target.xpPerDamage * damage }];
      }

      await NPC.updateOne({ _id: target.id }, { xpToRelease: target.xpToRelease });
    }
  }

  private async sendExpLevelUpEvents(
    expData: IIncreaseXPResult,
    character: ICharacter,
    target: INPC | ICharacter
  ): Promise<void> {
    const previousLevel = expData.level - 1;

    if (previousLevel === 0) {
      return;
    }

    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: `You advanced from level ${this.numberFormatter.formatNumber(
        previousLevel
      )} to level ${this.numberFormatter.formatNumber(expData.level)}.`,
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
    const levelUpEventPayload: IDisplayTextEvent = {
      targetId: character.id,
      value: exp,
      prefix: "+",
    };

    const nearbyCharacters = await this.characterView.getCharactersInView(character);

    for (const nearbyCharacter of nearbyCharacters) {
      this.socketMessaging.sendEventToUser<IDisplayTextEvent>(
        nearbyCharacter.channelId!,
        DisplayTextSocketEvents.DisplayText,
        levelUpEventPayload
      );
    }

    // warn character about his experience gain
    this.socketMessaging.sendEventToUser<IDisplayTextEvent>(
      character.channelId!,
      DisplayTextSocketEvents.DisplayText,
      levelUpEventPayload
    );

    const skill = await this.skillBuff.getSkillsWithBuff(character);
    const buffs = await this.characterBuffSkill.calculateAllActiveBuffs(character);

    this.socketMessaging.sendEventToUser(character.channelId!, SkillSocketEvents.ReadInfo, {
      skill,
      buffs,
    });
  }
}
