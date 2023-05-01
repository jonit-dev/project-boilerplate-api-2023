import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { BuffType, ICharacterPermanentBuff, ICharacterTemporaryBuff } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterBuffAttribute } from "./CharacterBuffAttribute";
import { CharacterBuffSkill } from "./CharacterBuffSkill";
import { CharacterBuffTracker } from "./CharacterBuffTracker";

@provide(CharacterBuff)
export class CharacterBuff {
  constructor(
    private characterBuffCharacterAttribute: CharacterBuffAttribute,
    private characterBuffSkill: CharacterBuffSkill,
    private characterBuffTracker: CharacterBuffTracker
  ) {}

  public async enableTemporaryBuff(character: ICharacter, buff: ICharacterTemporaryBuff): Promise<string> {
    return await this.enableBuff(character, buff);
  }

  public async enablePermanentBuff(character: ICharacter, buff: ICharacterPermanentBuff): Promise<string> {
    return await this.enableBuff(character, buff);
  }

  public async disableBuff(character: ICharacter, buffId: string, type: BuffType): Promise<boolean> {
    switch (type) {
      case "characterAttribute":
        return await this.characterBuffCharacterAttribute.disableBuff(character, buffId);

      case "skill":
        return await this.characterBuffSkill.disableBuff(character, buffId);
    }
  }

  public async disableAllBuffs(character: ICharacter): Promise<void> {
    const buffs = await this.characterBuffTracker.getAllCharacterBuffs(character);

    for (const buff of buffs) {
      if (buff.durationType === "temporary") {
        await this.disableBuff(character, buff._id!, buff.type);
      }
    }
  }

  private async enableBuff(
    character: ICharacter,
    buff: ICharacterPermanentBuff | ICharacterTemporaryBuff
  ): Promise<string> {
    switch (buff.type) {
      case "characterAttribute":
        const characterAttrBuffId = await this.characterBuffCharacterAttribute.enableBuff(character, buff);

        if (buff.durationType === "temporary") {
          setTimeout(async () => {
            await this.characterBuffCharacterAttribute.disableBuff(character, characterAttrBuffId);
          }, buff.durationSeconds * 1000);
        }

        return characterAttrBuffId;

      case "skill":
        const skillBuffId = await this.characterBuffSkill.enableBuff(character, buff);

        if (buff.durationType === "temporary") {
          setTimeout(async () => {
            await this.characterBuffSkill.disableBuff(character, skillBuffId);
          }, buff.durationSeconds * 1000);
        }
        return skillBuffId;
    }
  }
}
