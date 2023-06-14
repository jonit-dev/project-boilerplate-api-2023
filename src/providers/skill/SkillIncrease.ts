import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterView } from "@providers/character/CharacterView";
import { CharacterWeapon } from "@providers/character/CharacterWeapon";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { CharacterBonusPenalties } from "@providers/character/characterBonusPenalties/CharacterBonusPenalties";
import { CharacterClassBonusOrPenalties } from "@providers/character/characterBonusPenalties/CharacterClassBonusOrPenalties";
import { CharacterRaceBonusOrPenalties } from "@providers/character/characterBonusPenalties/CharacterRaceBonusOrPenalties";
import { CharacterBuffSkill } from "@providers/character/characterBuff/CharacterBuffSkill";
import { CharacterBuffTracker } from "@providers/character/characterBuff/CharacterBuffTracker";
import { NPC_GIANT_FORM_EXPERIENCE_MULTIPLIER } from "@providers/constants/NPCConstants";
import {
  BASIC_INCREASE_HEALTH_MANA,
  SP_CRAFTING_INCREASE_RATIO,
  SP_INCREASE_RATIO,
  SP_MAGIC_INCREASE_TIMES_MANA,
} from "@providers/constants/SkillConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SpellLearn } from "@providers/spells/SpellLearn";
import { NumberFormatter } from "@providers/text/NumberFormatter";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import {
  AnimationEffectKeys,
  CharacterClass,
  CharacterSocketEvents,
  DisplayTextSocketEvents,
  ICharacterAttributeChanged,
  IDisplayTextEvent,
  IUIShowMessage,
  LifeBringerRaces,
  ShadowWalkerRaces,
  UISocketEvents,
} from "@rpg-engine/shared";
import { ItemSubType } from "@rpg-engine/shared/dist/types/item.types";
import {
  BasicAttribute,
  CharacterAttributes,
  IIncreaseSPResult,
  IIncreaseXPResult,
  ISkillDetails,
  SKILLS_MAP,
  SkillEventType,
  SkillSocketEvents,
} from "@rpg-engine/shared/dist/types/skills.types";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { SkillBuff } from "./SkillBuff";
import { SkillCalculator } from "./SkillCalculator";
import { SkillCraftingMapper } from "./SkillCraftingMapper";
import { SkillFunctions } from "./SkillFunctions";
import { SkillGainValidation } from "./SkillGainValidation";
import { CraftingSkillsMap } from "./constants";

@provide(SkillIncrease)
export class SkillIncrease {
  constructor(
    private skillCalculator: SkillCalculator,
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private animationEffect: AnimationEffect,
    private spellLearn: SpellLearn,
    private characterBonusPenalties: CharacterBonusPenalties,
    private skillFunctions: SkillFunctions,
    private skillGainValidation: SkillGainValidation,
    private characterWeapon: CharacterWeapon,
    private inMemoryHashTable: InMemoryHashTable,
    private characterClassBonusOrPenalties: CharacterClassBonusOrPenalties,
    private characterRaceBonusOrPenalties: CharacterRaceBonusOrPenalties,
    private characterWeight: CharacterWeight,
    private skillMapper: SkillCraftingMapper,
    private numberFormatter: NumberFormatter,
    private characterBuffTracker: CharacterBuffTracker,
    private characterBuffSkill: CharacterBuffSkill,
    private newRelic: NewRelic,
    private skillBuff: SkillBuff
  ) {}

  /**
   * Calculates the sp gained according to weapons used and the xp gained by a character every time it causes damage in battle.
   * If new skill level is reached, sends the corresponding event to the character
   *
   */
  public async increaseSkillsOnBattle(attacker: ICharacter, target: ICharacter | INPC, damage: number): Promise<void> {
    await this.newRelic.trackTransaction(NewRelicTransactionCategory.Operation, "increaseSkillsOnBattle", async () => {
      // Get character skills and equipment to upgrade them
      const skills = (await Skill.findById(attacker.skills)
        .lean()
        .cacheQuery({
          cacheKey: `${attacker?._id}-skills`,
        })) as unknown as ISkill;

      if (!skills) {
        throw new Error(`skills not found for character ${attacker.id}`);
      }

      const equipment = await Equipment.findById(attacker.equipment)
        .lean()
        .cacheQuery({
          cacheKey: `${attacker._id}-equipment`,
        });
      if (!equipment) {
        throw new Error(`equipment not found for character ${attacker.id}`);
      }

      const weapon = await this.characterWeapon.getWeapon(attacker);

      const weaponSubType = weapon?.item ? weapon?.item.subType || "None" : "None";
      const skillName = SKILLS_MAP.get(weaponSubType);

      if (!skillName) {
        throw new Error(`Skill not found for weapon ${weaponSubType}`);
      }

      await this.recordXPinBattle(attacker, target, damage);

      const canIncreaseSP = this.skillGainValidation.canUpdateSkills(skills, skillName);

      if (!canIncreaseSP) {
        return;
      }

      // stronger the opponent, higher SP per hit it gives in your combat skills
      const bonus = await this.skillFunctions.calculateBonus(target, target.skills);
      const increasedWeaponSP = this.increaseSP(skills, weaponSubType, undefined, SKILLS_MAP, bonus);

      let increasedStrengthSP;
      if (weaponSubType !== ItemSubType.Magic && weaponSubType !== ItemSubType.Staff) {
        increasedStrengthSP = this.increaseSP(skills, BasicAttribute.Strength);
      }

      await this.skillFunctions.updateSkills(skills, attacker);

      await this.characterBonusPenalties.applyRaceBonusPenalties(attacker, weaponSubType);

      if (weaponSubType !== ItemSubType.Magic && weaponSubType !== ItemSubType.Staff) {
        await this.characterBonusPenalties.applyRaceBonusPenalties(attacker, BasicAttribute.Strength);
      }

      // If character strength skill level increased, send level up event
      if (increasedStrengthSP && increasedStrengthSP.skillLevelUp && attacker.channelId) {
        await this.skillFunctions.sendSkillLevelUpEvents(increasedStrengthSP, attacker, target);
        await this.characterWeight.updateCharacterWeight(attacker);
      }

      // If character skill level increased, send level up event specifying the skill that upgraded
      if (increasedWeaponSP.skillLevelUp && attacker.channelId) {
        await this.skillFunctions.sendSkillLevelUpEvents(increasedWeaponSP, attacker, target);
      }
    });
  }

  public async increaseShieldingSP(character: ICharacter): Promise<void> {
    await this.newRelic.trackTransaction(NewRelicTransactionCategory.Operation, "increaseShieldingSP", async () => {
      const characterWithRelations = (await Character.findById(character.id)
        .populate({
          path: "skills",
          model: "Skill",
        })
        .lean()
        .populate({
          path: "equipment",
          model: "Equipment",

          populate: {
            path: "rightHand leftHand",
            model: "Item",
          },
        })
        .lean()) as ICharacter;

      if (!characterWithRelations) {
        throw new Error(`character not found for id ${character.id}`);
      }
      const skills = characterWithRelations.skills as ISkill;

      const canIncreaseSP = this.skillGainValidation.canUpdateSkills(skills as ISkill, "shielding");

      if (!canIncreaseSP) {
        return;
      }

      const equipment = characterWithRelations.equipment as IEquipment;

      const rightHandItem = equipment?.rightHand as IItem;
      const leftHandItem = equipment?.leftHand as IItem;

      let result = {} as IIncreaseSPResult;
      if (rightHandItem?.subType === ItemSubType.Shield) {
        result = this.increaseSP(skills, rightHandItem.subType);
      } else {
        if (leftHandItem?.subType === ItemSubType.Shield) {
          result = this.increaseSP(skills, leftHandItem.subType);
        }
      }

      await this.skillFunctions.updateSkills(skills, character);
      if (!_.isEmpty(result)) {
        if (result.skillLevelUp && characterWithRelations.channelId) {
          await this.skillFunctions.sendSkillLevelUpEvents(result, characterWithRelations);
        }

        if (rightHandItem?.subType === ItemSubType.Shield) {
          await this.characterBonusPenalties.applyRaceBonusPenalties(character, ItemSubType.Shield);
        } else {
          if (leftHandItem?.subType === ItemSubType.Shield) {
            await this.characterBonusPenalties.applyRaceBonusPenalties(character, ItemSubType.Shield);
          }
        }
      }
    });
  }

  public async increaseMagicSP(character: ICharacter, power: number): Promise<void> {
    await this.newRelic.trackTransaction(NewRelicTransactionCategory.Operation, "increaseMagicSP", async () => {
      await this.increaseBasicAttributeSP(character, BasicAttribute.Magic, this.getMagicSkillIncreaseCalculator(power));
    });
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
    const skills = (await Skill.findById(character.skills)
      .lean()
      .cacheQuery({
        cacheKey: `${character?._id}-skills`,
      })) as ISkill;
    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }

    const canIncreaseSP = this.skillGainValidation.canUpdateSkills(skills as ISkill, attribute);

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

    const skills = (await Skill.findById(character.skills).cacheQuery({
      cacheKey: `${character?._id}-skills`,
    })) as unknown as ISkill;
    if (!skills) {
      throw new Error(`skills not found for character ${character.id}`);
    }

    const canIncreaseSP = this.skillGainValidation.canUpdateSkills(skills as ISkill, skillToUpdate);

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

  /**
   * This function distributes
   * the xp stored in the xpToRelease array to the corresponding
   * characters and notifies them if leveled up
   */
  public async releaseXP(target: INPC): Promise<void> {
    if (target.health > 0 || target.xpReleased) {
      // if target stills alive, he cant release XP.
      return;
    }

    let levelUp = false;
    let previousLevel = 0;
    // The xp gained is released once the NPC dies.
    // Store the xp in the xpToRelease array
    // before adding the character to the array, check if the character already caused some damage

    target.xpToRelease = _.uniqBy(target.xpToRelease, "xpId");

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
        await this.increaseMaxManaMaxHealth(character._id);

        await this.sendExpLevelUpEvents({ level: skills.level, previousLevel, exp }, character, target);
        setTimeout(async () => {
          await this.spellLearn.learnLatestSkillLevelSpells(character._id, true);
        }, 5000);
      }

      await this.warnCharactersAroundAboutExpGains(character, exp);
    }

    await NPC.updateOne({ _id: target._id }, { xpToRelease: target.xpToRelease, xpReleased: true });
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
            target.xpToRelease[i].xp! += target.xpPerDamage * damage;
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

  private getMagicSkillIncreaseCalculator(spellPower: number): Function {
    return ((power: number, skillDetails: ISkillDetails): number => {
      const manaSp = Math.round((power ?? 0) * SP_MAGIC_INCREASE_TIMES_MANA * 100) / 100;
      return this.calculateNewSP(skillDetails) + manaSp;
    }).bind(this, spellPower);
  }

  public async increaseMaxManaMaxHealth(characterId: Types.ObjectId): Promise<void> {
    const character = (await Character.findById(characterId).lean()) as ICharacter;
    const skills = (await Skill.findById(character.skills)
      .lean()
      .cacheQuery({
        cacheKey: `${character?._id}-skills`,
      })) as ISkill;

    const classBonusOrPenalties = this.characterClassBonusOrPenalties.getClassBonusOrPenalties(
      character.class as CharacterClass
    );

    const raceBonusOrPenaltises = this.characterRaceBonusOrPenalties.getRaceBonusOrPenaltises(
      character.race as LifeBringerRaces | ShadowWalkerRaces
    );

    const level = skills.level;
    const baseValue = 100;

    const totalStrength =
      Math.round(
        (classBonusOrPenalties.basicAttributes.strength + raceBonusOrPenaltises.basicAttributes.strength) * 100
      ) / 100;
    const increaseRateStrength = 1 + BASIC_INCREASE_HEALTH_MANA * (1 + totalStrength);
    const maxHealth = Math.round(baseValue * Math.pow(increaseRateStrength, level - 1));

    const totalMagic =
      Math.round((classBonusOrPenalties.basicAttributes.magic + raceBonusOrPenaltises.basicAttributes.magic) * 100) /
      100;
    const increaseRateMagic = 1 + BASIC_INCREASE_HEALTH_MANA * (1 + totalMagic);
    const maxMana = Math.round(baseValue * Math.pow(increaseRateMagic, level - 1));

    const result = await this.updateEntitiesAttributes(character, { maxHealth, maxMana });

    if (!result) {
      throw new Error(`Failed to increase max health and mana. Character ${character._id} not found.`);
    }
  }

  private async updateEntitiesAttributes(
    character: ICharacter,
    updateAttributes: { maxHealth: number; maxMana: number }
  ): Promise<boolean> {
    const { maxHealth, maxMana } = Object.freeze(updateAttributes);

    const allBuffsOnMaxHealth = await this.characterBuffTracker.getAllBuffAbsoluteChanges(
      character._id,
      CharacterAttributes.MaxHealth
    );
    const allBuffsOnMaxMana = await this.characterBuffTracker.getAllBuffAbsoluteChanges(
      character._id,
      CharacterAttributes.MaxMana
    );

    const updatedCharacter = (await Character.findOneAndUpdate(
      { _id: character._id },
      { maxHealth: maxHealth + allBuffsOnMaxHealth, maxMana: maxMana + allBuffsOnMaxMana },
      { new: true }
    ).lean()) as ICharacter;

    if (!updatedCharacter) {
      return false;
    }

    const payload: ICharacterAttributeChanged = {
      targetId: updatedCharacter._id,
      maxHealth: maxHealth + allBuffsOnMaxHealth,
      maxMana: maxMana + allBuffsOnMaxMana,
    };

    this.socketMessaging.sendEventToUser(updatedCharacter.channelId!, CharacterSocketEvents.AttributeChanged, payload);

    if (
      updatedCharacter.maxHealth === maxHealth + allBuffsOnMaxHealth &&
      updatedCharacter.maxMana === maxMana + allBuffsOnMaxMana
    ) {
      return true;
    }

    return false;
  }
}
