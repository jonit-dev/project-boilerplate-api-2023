import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterClassBonusOrPenalties } from "@providers/character/characterBonusPenalties/CharacterClassBonusOrPenalties";
import { CharacterRaceBonusOrPenalties } from "@providers/character/characterBonusPenalties/CharacterRaceBonusOrPenalties";
import { CharacterBuffTracker } from "@providers/character/characterBuff/CharacterBuffTracker";
import { BASIC_INCREASE_HEALTH_MANA } from "@providers/constants/SkillConstants";
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

    const classBonusOrPenalties = this.characterClassBonusOrPenalties.getClassBonusOrPenalties(
      character.class as CharacterClass
    );

    const raceBonusOrPenalties = this.characterRaceBonusOrPenalties.getRaceBonusOrPenaltises(
      character.race as LifeBringerRaces | ShadowWalkerRaces
    );

    const level = skills.level;
    const baseValue = 100;

    const totalStrength =
      Math.round(
        (classBonusOrPenalties.basicAttributes.strength + raceBonusOrPenalties.basicAttributes.strength) * 100
      ) / 100;
    const increaseRateStrength = 1 + BASIC_INCREASE_HEALTH_MANA * (1 + totalStrength);
    const maxHealth = Math.round(baseValue * Math.pow(increaseRateStrength, level - 1));

    const totalMagic =
      Math.round((classBonusOrPenalties.basicAttributes.magic + raceBonusOrPenalties.basicAttributes.magic) * 100) /
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
