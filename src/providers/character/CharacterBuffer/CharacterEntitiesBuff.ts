import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { MovementSpeed } from "@providers/constants/MovementConstants";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterEntities, IAppliedBuffsEffect } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";
import { BuffSkillFunctions } from "./BuffSkillFunctions";

@provide(CharacterEntitiesBuff)
export class CharacterEntitiesBuff {
  constructor(private buffSkillFunctions: BuffSkillFunctions, private socketMessaging: SocketMessaging) {}

  public async updateCharacterEntities(
    character: ICharacter,
    characterEntities: CharacterEntities,
    buff: number,
    buffId?: Types.ObjectId
  ): Promise<IAppliedBuffsEffect> {
    const isAdding = buff > 0;
    const appliedBuffsEffect = await this.characterEntitiesHandler(
      character,
      characterEntities,
      isAdding,
      buff,
      buffId
    );

    return appliedBuffsEffect;
  }

  private async characterEntitiesHandler(
    character: ICharacter,
    characterEntities: CharacterEntities,
    isAdding: boolean,
    buff: number,
    buffId?: Types.ObjectId
  ): Promise<IAppliedBuffsEffect> {
    let diffLvl = 0;
    let appliedBuffsEffect: { _id: Types.ObjectId; key: string; value: number } = {
      _id: new Types.ObjectId(),
      key: "",
      value: 0,
    };

    const skillLvl = character[characterEntities];
    if (isAdding) {
      diffLvl = this.buffSkillFunctions.calculateIncreaseLvl(skillLvl, buff);
    } else if (character && character.appliedBuffsEffects && buffId) {
      diffLvl = this.buffSkillFunctions.getValueByBuffId(character.appliedBuffsEffects, buffId);
    }

    if (characterEntities === CharacterEntities.Speed) {
      diffLvl = MovementSpeed.ExtraFast - MovementSpeed.Slow;
      if (buff < 0) {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Haste Spell its over!");
      } else {
        this.socketMessaging.sendErrorMessageToCharacter(character, "Haste Spell its activated!");
      }
    }

    const updateSuccess = await this.buffSkillFunctions.updateBuffEntities(
      character,
      characterEntities,
      diffLvl,
      isAdding
    );

    if (updateSuccess) {
      appliedBuffsEffect = await this.buffSkillFunctions.updateBuffEffectOnCharacter(
        character,
        characterEntities,
        diffLvl,
        isAdding,
        buffId
      );
    }

    return appliedBuffsEffect;
  }

  public async checkHasteActivated(character: ICharacter): Promise<boolean> {
    const refreshCharacter = (await Character.findById(character._id).lean()) as ICharacter;
    const appliedBuffEffect = refreshCharacter.appliedBuffsEffects;
    let hasteSpeed = 0;

    if (appliedBuffEffect) {
      hasteSpeed = this.buffSkillFunctions.getTotalValueByKey(appliedBuffEffect, CharacterEntities.Speed);
    }
    if (hasteSpeed !== 0) {
      return true;
    } else {
      return false;
    }
  }
}
