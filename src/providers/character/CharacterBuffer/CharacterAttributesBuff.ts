import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterAttributes, IAppliedBuffsEffect } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { BuffSkillFunctions } from "./BuffSkillFunctions";

@provide(CharacterAttributesBuff)
export class CharacterAttributesBuff {
  constructor(private buffSkillFunctions: BuffSkillFunctions, private socketMessaging: SocketMessaging) {}

  public async updateCharacterAttributes(
    characterId: Types.ObjectId,
    characterAttributes: CharacterAttributes,
    buff: number,
    buffId?: Types.ObjectId
  ): Promise<IAppliedBuffsEffect> {
    const isAdding = buff > 0;
    let appliedBuffsEffect: { _id: Types.ObjectId; key: string; value: number } = {
      _id: new Types.ObjectId(),
      key: "",
      value: 0,
    };
    try {
      appliedBuffsEffect = await this.characterAttributesHandler(
        characterId,
        characterAttributes,
        isAdding,
        buff,
        buffId
      );

      return appliedBuffsEffect;
    } catch (error) {
      console.error(`Error: ${error} - ${characterId}`);
      return appliedBuffsEffect;
    }
  }

  private async characterAttributesHandler(
    characterId: Types.ObjectId,
    characterAttributes: CharacterAttributes,
    isAdding: boolean,
    buff: number,
    buffId?: Types.ObjectId
  ): Promise<IAppliedBuffsEffect> {
    let appliedBuffsEffect: IAppliedBuffsEffect = {
      _id: new Types.ObjectId(),
      key: "",
      value: 0,
    };

    try {
      const character = (await Character.findById(characterId).lean()) as ICharacter;

      let diffLvl = 0;
      const skillLvl = character[characterAttributes];

      if (isAdding) {
        if (characterAttributes === CharacterAttributes.AttackIntervalSpeed) {
          diffLvl =
            character.attackIntervalSpeed -
            Math.min(Math.max(character.attackIntervalSpeed * (1 - buff / 100), 500), 1700);
        } else if (characterAttributes === CharacterAttributes.Speed) {
          diffLvl = MovementSpeed.ExtraFast - MovementSpeed.Slow;
        } else {
          diffLvl = this.buffSkillFunctions.calculateIncreaseLvl(skillLvl, buff);
        }
      } else if (character && character.appliedBuffsEffects && buffId) {
        diffLvl = this.buffSkillFunctions.getValueByBuffId(character.appliedBuffsEffects, buffId);
      }

      const updateSuccess = await this.buffSkillFunctions.updateBuffEntities(
        character._id,
        characterAttributes,
        diffLvl,
        isAdding
      );

      if (updateSuccess) {
        appliedBuffsEffect = await this.buffSkillFunctions.updateBuffEffectOnCharacter(
          characterId,
          characterAttributes,
          diffLvl,
          isAdding,
          buffId
        );

        const message = buff < 0 ? "Spell has ended!" : "Spell activated!";
        this.socketMessaging.sendErrorMessageToCharacter(character, message);
      }

      return appliedBuffsEffect;
    } catch (error) {
      console.error(`Error: ${error} - ${characterId}`);
      throw new Error("An error occurred while handling character entities.");
    }
  }

  public async checkHasteActivated(characterId: Types.ObjectId): Promise<boolean> {
    const refreshCharacter = (await Character.findById(characterId).lean()) as ICharacter;
    const appliedBuffEffect = refreshCharacter.appliedBuffsEffects;
    let hasteSpeed = 0;

    if (appliedBuffEffect) {
      hasteSpeed = this.buffSkillFunctions.getTotalValueByKey(appliedBuffEffect, CharacterAttributes.Speed);
    }
    if (hasteSpeed !== 0) {
      return true;
    } else {
      return false;
    }
  }
}
