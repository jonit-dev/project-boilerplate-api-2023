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
    return await this.enableBuff(character, buff);
  }

  public async enablePermanentBuff(
    character: ICharacter,
    buff: ICharacterPermanentBuff
  ): Promise<ICharacterBuff | undefined> {
    return await this.enableBuff(character, buff);
  }

  public async disableBuff(
    character: ICharacter,
    buffId: string,
    type: CharacterBuffType
  ): Promise<boolean | undefined> {
    switch (type) {
      case CharacterBuffType.CharacterAttribute:
        return await this.characterBuffCharacterAttribute.disableBuff(character, buffId);

      case CharacterBuffType.Skill:
        return await this.characterBuffSkill.disableBuff(character, buffId);
    }
  }

  public async disableAllBuffs(
    character: ICharacter,
    durationType: CharacterBuffDurationType | "all" = CharacterBuffDurationType.Temporary
  ): Promise<void> {
    const buffs = await this.characterBuffTracker.getAllCharacterBuffs(character);

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
    buff: ICharacterPermanentBuff | ICharacterTemporaryBuff
  ): Promise<ICharacterBuff | undefined> {
    switch (buff.type) {
      case "characterAttribute":
        const newCharBuff = await this.characterBuffCharacterAttribute.enableBuff(character, buff);

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
        const newSkillBuff = await this.characterBuffSkill.enableBuff(character, buff);

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
