import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterView } from "@providers/character/CharacterView";
import { CharacterBuffSkill } from "@providers/character/characterBuff/CharacterBuffSkill";
import { NPC_GIANT_FORM_EXPERIENCE_MULTIPLIER } from "@providers/constants/NPCConstants";
import { MODE_EXP_MULTIPLIER } from "@providers/constants/SkillConstants";
import { spellLearn } from "@providers/inversify/container";
import { Locker } from "@providers/locks/Locker";
import PartyManagement from "@providers/party/PartyManagement";
import { SkillBuff } from "@providers/skill/SkillBuff";
import { SkillCalculator } from "@providers/skill/SkillCalculator";
import { SkillFunctions } from "@providers/skill/SkillFunctions";
import { SkillStatsIncrease } from "@providers/skill/SkillStatsIncrease";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NumberFormatter } from "@providers/text/NumberFormatter";
import { Time } from "@providers/time/Time";
import { NewRelicMetricCategory, NewRelicSubCategory } from "@providers/types/NewRelicTypes";
import {
  AnimationEffectKeys,
  CharacterPartyBenefits,
  DisplayTextSocketEvents,
  IDisplayTextEvent,
  IIncreaseXPResult,
  IUIShowMessage,
  Modes,
  SkillEventType,
  SkillSocketEvents,
  UISocketEvents,
} from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";

import random from "lodash/random";
import uniqBy from "lodash/uniqBy";
import { Types } from "mongoose";
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
    private skillLvUpStatsIncrease: SkillStatsIncrease,
    private locker: Locker,
    private partyManagement: PartyManagement,
    private newRelic: NewRelic
  ) {}

  /**
   * This function distributes
   * the xp stored in the xpToRelease array to the corresponding
   * characters and notifies them if leveled up
   */
  public async releaseXP(target: INPC): Promise<void> {
    await this.time.waitForMilliseconds(random(0, 50)); // add artificial delay to avoid concurrency

    const hasLock = await this.locker.lock(`npc-${target._id}-release-xp`);

    if (!hasLock) {
      return;
    }

    // The xp gained is released once the NPC dies.
    // Store the xp in the xpToRelease array
    // before adding the character to the array, check if the character already caused some damage

    target.xpToRelease = uniqBy(target.xpToRelease, "xpId");

    while (target.xpToRelease.length > 0) {
      const record = target.xpToRelease.shift();
      const characterAndSkills = await this.validateCharacterAndSkills(record!.charId);
      if (!characterAndSkills) {
        continue;
      }

      const character = (await Character.findById(record!.charId).lean({
        virtuals: true,
        defaults: true,
      })) as ICharacter;

      if (!character) {
        return this.releaseXP(target);
      }

      const characterMode: Modes = Object.values(Modes).find((mode) => mode === character.mode) ?? Modes.SoftMode;

      const expMultiplier =
        (target.isGiantForm ? NPC_GIANT_FORM_EXPERIENCE_MULTIPLIER : 1) * MODE_EXP_MULTIPLIER[characterMode];

      let baseExp = record!.xp * expMultiplier;
      let expRecipients: Types.ObjectId[] = [];

      if (record!.partyId) {
        const party = await this.partyManagement.getPartyByCharacterId(characterAndSkills.character._id);

        if (!party) {
          continue;
        }

        const partyBenefit = party.benefits?.find((benefits) => benefits.benefit === CharacterPartyBenefits.Experience);

        baseExp += partyBenefit ? (baseExp * partyBenefit.value) / 100 : 0;
        expRecipients = [...party.members.map((member) => member._id), party.leader._id];
      } else {
        expRecipients.push(record!.charId);
      }

      const charactersInRange = await this.partyManagement.isWithinRange(target, expRecipients, 150);
      if (charactersInRange.length === 0) {
        continue;
      }

      const expPerRecipient = Number((baseExp / charactersInRange.length ?? 1).toFixed(2));

      for (const characterInRange of charactersInRange) {
        const recipientCharacterAndSkills = await this.validateCharacterAndSkills(characterInRange);

        if (!recipientCharacterAndSkills) {
          continue;
        }

        await this.updateSkillsAndSendEvents(
          recipientCharacterAndSkills.character,
          recipientCharacterAndSkills.skills,
          expPerRecipient,
          target
        );
      }
    }

    await NPC.updateOne({ _id: target._id }, { xpToRelease: target.xpToRelease });
  }

  /**
   * Calculates the xp gained by a character every time it causes damage in battle
   * In case the target is NPC, it stores the character's xp gained in the xpToRelease array
   */

  public async recordXPinBattle(attacker: ICharacter, target: ICharacter | INPC, damage: number): Promise<void> {
    try {
      const canProceed = await this.locker.lock(`npc-${target._id}-record-xp`);
      if (!canProceed) {
        return;
      }
      // For now, only supported increasing XP when target is NPC
      if (target.type === "NPC" && damage > 0) {
        target = target as INPC;
        target.xpToRelease = uniqBy(target.xpToRelease, "xpId");
        const party = (await this.partyManagement.getPartyByCharacterId(attacker.id)) as ICharacterParty;
        // Store the xp in the xpToRelease array
        // before adding the character to the array, check if the character already caused some damage
        if (typeof target.xpToRelease !== "undefined") {
          let found = false;
          for (const i in target.xpToRelease) {
            const xpCondition = party
              ? target.xpToRelease[i].partyId?.toString() === party.id
              : target.xpToRelease[i].charId?.toString() === attacker.id;
            if (xpCondition) {
              found = true;
              target.xpToRelease[i].xp! += target.xpPerDamage * damage;
              break;
            }
          }
          if (!found) {
            target.xpToRelease.push({
              xpId: uuidv4(),
              charId: attacker.id,
              partyId: party ? party.id : null, // can be null if the attacker is not in a party
              xp: target.xpPerDamage * damage,
            });
          }
        } else {
          target.xpToRelease = [
            {
              xpId: uuidv4(),
              charId: attacker.id,
              partyId: party ? party.id : null, // can be null if the attacker is not in a party
              xp: target.xpPerDamage * damage,
            },
          ];
        }
        await NPC.updateOne({ _id: target.id }, { xpToRelease: target.xpToRelease });
      }
    } catch (error) {
      console.error(error);
      await this.locker.unlock(`npc-${target._id}-record-xp`);
    } finally {
      await this.locker.unlock(`npc-${target._id}-record-xp`);
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

  private async validateCharacterAndSkills(id: Types.ObjectId): Promise<{
    character: ICharacter;
    skills: ISkill;
  } | null> {
    const character = (await Character.findById(id).lean({
      virtuals: true,
      defaults: true,
    })) as ICharacter;
    if (!character) {
      return null;
    }

    await clearCacheForKey(`characterBuffs_${character._id}`);
    // Get character skills
    const skills = (await Skill.findById(character.skills)
      .lean()
      .cacheQuery({
        cacheKey: `${character._id}-skills`,
      })) as ISkill;
    if (!skills) {
      return null;
    }
    return { character, skills };
  }

  private async updateSkillsAndSendEvents(
    character: ICharacter,
    skills: ISkill,
    exp: number,
    target: INPC
  ): Promise<void> {
    let levelUp = false;
    let previousLevel = 0;

    // const characterMode: Modes = Object.values(Modes)
    //   .find((mode) => mode === character.mode) ?? Modes.SoftMode;

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

      this.newRelic.trackMetric(
        NewRelicMetricCategory.Count,
        NewRelicSubCategory.Characters,
        `${character.class}-LevelUp`,
        1
      );
    }

    await this.warnCharactersAroundAboutExpGains(character, exp);
  }
}
