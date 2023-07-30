import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterClassBonusOrPenalties } from "@providers/character/characterBonusPenalties/CharacterClassBonusOrPenalties";
import { CharacterRaceBonusOrPenalties } from "@providers/character/characterBonusPenalties/CharacterRaceBonusOrPenalties";
import { CharacterBuffTracker } from "@providers/character/characterBuff/CharacterBuffTracker";
import { HEALTH_MANA_BASE_INCREASE_RATE } from "@providers/constants/SkillConstants";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  CharacterAttributes,
  CharacterClass,
  CharacterSocketEvents,
  ICharacterAttributeChanged,
  LifeBringerRaces,
  ShadowWalkerRaces,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(SkillStatsIncrease)
export class SkillStatsIncrease {
  constructor(
    private characterClassBonusOrPenalties: CharacterClassBonusOrPenalties,
    private characterRaceBonusOrPenalties: CharacterRaceBonusOrPenalties,
    private socketMessaging: SocketMessaging,
    private characterBuffTracker: CharacterBuffTracker
  ) {}

  public async increaseMaxManaMaxHealth(characterId: Types.ObjectId): Promise<void> {
    const character = (await Character.findById(characterId).lean()) as ICharacter;
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;

    const totalStrength = this.calculateTotalAttribute(character, "strength");
    const totalMagic = this.calculateTotalAttribute(character, "magic");

    const newHealth = this.calculateNewAttribute(
      character.class as CharacterClass,
      "strength",
      totalStrength,
      skills.level
    );
    const newMana = this.calculateNewAttribute(character.class as CharacterClass, "magic", totalMagic, skills.level);

    const result = await this.updateEntitiesAttributes(character, { maxHealth: newHealth, maxMana: newMana });

    if (!result) {
      throw new Error(`Failed to increase max health and mana. Character ${character._id} not found.`);
    }
  }

  private calculateTotalAttribute(character: ICharacter, attribute: "strength" | "magic"): number {
    const classBonusOrPenalties = this.characterClassBonusOrPenalties.getClassBonusOrPenalties(
      character.class as CharacterClass
    );

    const raceBonusOrPenalties = this.characterRaceBonusOrPenalties.getRaceBonusOrPenaltises(
      character.race as LifeBringerRaces | ShadowWalkerRaces
    );

    return (
      Math.round(
        (classBonusOrPenalties.basicAttributes[attribute] + raceBonusOrPenalties.basicAttributes[attribute]) * 100
      ) / 100
    );
  }

  private calculateNewAttribute(
    characterClass: CharacterClass,
    attribute: "strength" | "magic",
    totalAttribute: number,
    level: number
  ): number {
    const baseValue = 100;

    const { healthIncreaseRate, manaIncreaseRate } = this.getHealthManaIncreaseRateByClass(characterClass);

    const increaseRate = 1 + (attribute === "strength" ? healthIncreaseRate : manaIncreaseRate) * (1 + totalAttribute);
    return Math.round(baseValue + increaseRate * (level - 1));
  }

  private getHealthManaIncreaseRateByClass(characterClass: CharacterClass): {
    healthIncreaseRate: number;
    manaIncreaseRate: number;
  } {
    const baseIncreaseRate = HEALTH_MANA_BASE_INCREASE_RATE;

    const classHealthManaIncreaseRate = {
      [CharacterClass.Warrior]: {
        health: baseIncreaseRate * 2,
        mana: baseIncreaseRate * 0.5,
      },
      [CharacterClass.Berserker]: {
        health: baseIncreaseRate * 2,
        mana: baseIncreaseRate * 0.5,
      },
      [CharacterClass.Druid]: {
        health: baseIncreaseRate * 0.75,
        mana: baseIncreaseRate * 1.75,
      },
      [CharacterClass.Sorcerer]: {
        health: baseIncreaseRate * 0.5,
        mana: baseIncreaseRate * 2,
      },
      [CharacterClass.Hunter]: {
        health: baseIncreaseRate * 1.25,
        mana: baseIncreaseRate * 1.25,
      },
      [CharacterClass.Rogue]: {
        health: baseIncreaseRate * 1.25,
        mana: baseIncreaseRate * 1.25,
      },
    };

    let result = classHealthManaIncreaseRate[characterClass];

    if (!result) {
      result = {
        health: baseIncreaseRate,
        mana: baseIncreaseRate,
      };
    }

    return {
      healthIncreaseRate: result.health,
      manaIncreaseRate: result.mana,
    };
  }

  private async updateEntitiesAttributes(
    character: ICharacter,
    updateAttributes: { maxHealth: number; maxMana: number }
  ): Promise<boolean> {
    const { maxHealth, maxMana } = Object.freeze(updateAttributes);

    const allBuffsOnMaxHealth = await this.characterBuffTracker.getAllBuffPercentageChanges(
      character._id,
      CharacterAttributes.MaxHealth
    );
    const allBuffsOnMaxMana = await this.characterBuffTracker.getAllBuffPercentageChanges(
      character._id,
      CharacterAttributes.MaxMana
    );

    const updatedCharacter = (await Character.findOneAndUpdate(
      { _id: character._id },
      {
        maxHealth: Math.round(maxHealth * (1 + allBuffsOnMaxHealth / 100)),
        maxMana: Math.round(maxMana * (1 + allBuffsOnMaxMana / 100)),
      },
      { new: true }
    ).lean()) as ICharacter;

    if (!updatedCharacter) {
      return false;
    }

    const payload: ICharacterAttributeChanged = {
      targetId: updatedCharacter._id,
      maxHealth: Math.round(maxHealth * (1 + allBuffsOnMaxHealth / 100)),
      maxMana: Math.round(maxMana * (1 + allBuffsOnMaxMana / 100)),
    };

    this.socketMessaging.sendEventToUser(updatedCharacter.channelId!, CharacterSocketEvents.AttributeChanged, payload);

    if (
      updatedCharacter.maxHealth === Math.round(maxHealth * (1 + allBuffsOnMaxHealth / 100)) &&
      updatedCharacter.maxMana === Math.round(maxMana * (1 + allBuffsOnMaxMana / 100))
    ) {
      return true;
    }

    return false;
  }
}
