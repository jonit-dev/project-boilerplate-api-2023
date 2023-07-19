import { CharacterBuff } from "@entities/ModuleCharacter/CharacterBuffModel";
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import {
  CharacterBuffDurationType,
  CharacterBuffType,
  ICharacterBuff,
  ICharacterPermanentBuff,
  ICharacterTemporaryBuff,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterBuffAttribute } from "./CharacterBuffAttribute";
import { CharacterBuffSkill } from "./CharacterBuffSkill";
import { CharacterBuffTracker } from "./CharacterBuffTracker";

@provide(CharacterBuffActivator)
export class CharacterBuffActivator {
  constructor(
    private characterBuffCharacterAttribute: CharacterBuffAttribute,
    private characterBuffSkill: CharacterBuffSkill,
    private characterBuffTracker: CharacterBuffTracker
  ) {}

  public async enableTemporaryBuff(
    character: ICharacter,
    buff: ICharacterTemporaryBuff
  ): Promise<ICharacterBuff | undefined> {
    try {
      let noMessage;

      // Enable the buff directly if it's stackable or doesn't originate from anywhere
      if (!(buff.isStackable || !buff.originateFrom)) {
        // Find the character buffs that have the same owner and originate from the same place
        const characterBuff = (await CharacterBuff.findOne({
          owner: character.id,
          originateFrom: buff.originateFrom,
        }).lean()) as ICharacterBuff;

        // If any such buffs exist, disable the buff
        if (characterBuff) {
          await this.disableBuff(character, characterBuff._id!, characterBuff.type, true);
          noMessage = true;
        }
      }

      // Enable the buff
      return await this.enableBuff(character, buff, noMessage);
    } catch (error) {
      console.error(error);
      throw new Error(`Unable to enable temporary buff for character id: ${character.id}, buff id: ${buff._id!}.`);
    }
  }

  public async enablePermanentBuff(
    character: ICharacter,
    buff: ICharacterPermanentBuff,
    noMessage?: boolean
  ): Promise<ICharacterBuff | undefined> {
    return await this.enableBuff(character, buff, noMessage);
  }

  public async disableBuff(
    character: ICharacter,
    buffId: string,
    type: CharacterBuffType,
    noMessage?: boolean
  ): Promise<boolean | undefined> {
    switch (type) {
      case CharacterBuffType.CharacterAttribute:
        return await this.characterBuffCharacterAttribute.disableBuff(character, buffId, noMessage);

      case CharacterBuffType.Skill:
        return await this.characterBuffSkill.disableBuff(character, buffId, noMessage);
    }
  }

  public async disableAllBuffs(
    character: ICharacter,
    durationType: CharacterBuffDurationType | "all" = CharacterBuffDurationType.Temporary
  ): Promise<void> {
    const buffs = await this.characterBuffTracker.getAllCharacterBuffs(character._id);

    for (const buff of buffs) {
      if (durationType === "all") {
        await this.disableBuff(character, buff._id!, buff.type);
      }

      if (buff.durationType === durationType) {
        await this.disableBuff(character, buff._id!, buff.type);
      }
    }
  }

  public async disableAllTemporaryBuffsAllCharacters(): Promise<void> {
    const temporaryBuffs = await CharacterBuff.find({ durationType: CharacterBuffDurationType.Temporary }).lean();

    for (const buff of temporaryBuffs) {
      const character = (await Character.findById(buff.owner).lean()) as ICharacter;

      if (!character) {
        continue;
      }

      await this.disableBuff(character, buff._id!, buff.type as CharacterBuffType);
    }
  }

  private async enableBuff(
    character: ICharacter,
    buff: ICharacterPermanentBuff | ICharacterTemporaryBuff,
    noMessage?: boolean
  ): Promise<ICharacterBuff | undefined> {
    switch (buff.type) {
      case "characterAttribute":
        const newCharBuff = await this.characterBuffCharacterAttribute.enableBuff(character, buff, noMessage);

        if (!newCharBuff) {
          throw new Error(`Failed to enable buff with details ${JSON.stringify(buff)}`);
        }

        if (buff.durationType === "temporary") {
          setTimeout(async () => {
            await this.characterBuffCharacterAttribute.disableBuff(character, newCharBuff._id!);
          }, buff.durationSeconds * 1000);
        }

        return newCharBuff;

      case "skill":
        const newSkillBuff = await this.characterBuffSkill.enableBuff(character, buff, noMessage);

        if (!newSkillBuff) {
          throw new Error(`Failed to enable buff with details ${JSON.stringify(buff)}`);
        }

        if (buff.durationType === "temporary") {
          setTimeout(async () => {
            await this.characterBuffSkill.disableBuff(character, newSkillBuff._id!);
          }, buff.durationSeconds * 1000);
        }
        return newSkillBuff;
    }
  }
}
