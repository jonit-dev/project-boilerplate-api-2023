import { CharacterBuff } from "@entities/ModuleCharacter/CharacterBuffModel";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterBuffDurationType, CharacterTrait, ICharacterBuff, ICharacterItemBuff } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { clearCacheForKey } from "speedgoose";
interface ICharacterBuffDeleteOptions {
  deleteTemporaryOnly?: boolean;
}

@provide(CharacterBuffTracker)
export class CharacterBuffTracker {
  public async addBuff(character: ICharacter, buff: ICharacterBuff): Promise<ICharacterBuff | undefined> {
    try {
      const newCharacterBuff = new CharacterBuff({
        owner: character._id,
        ...buff,
      });

      await newCharacterBuff.save();

      await clearCacheForKey(`characterBuffs_${character._id}`);

      if (newCharacterBuff.itemKey) {
        await clearCacheForKey(`characterBuff_${character._id}_${newCharacterBuff.itemKey}`);
      }

      return newCharacterBuff as ICharacterBuff;
    } catch (error) {
      console.error(error);
    }
  }

  public async getAllCharacterBuffs(character: ICharacter): Promise<ICharacterBuff[]> {
    const allCharacterBuffs = (await CharacterBuff.find({ owner: character._id })
      .lean()
      .cacheQuery({
        cacheKey: `characterBuffs_${character._id}`,
      })) as ICharacterBuff[];

    return allCharacterBuffs;
  }

  public async getAllBuffAbsoluteChanges(character: ICharacter, trait: CharacterTrait): Promise<number> {
    const characterBuffs = await this.getAllCharacterBuffs(character);

    const buffs = characterBuffs.filter((buff) => buff.trait === trait);

    if (!buffs) {
      return 0;
    }

    return buffs.reduce((acc, buff) => acc + buff.absoluteChange!, 0);
  }

  public async getBuffByItemId(character: ICharacter, itemId: string): Promise<ICharacterItemBuff[]> {
    const currentBuffs = (await this.getAllCharacterBuffs(character)) as ICharacterItemBuff[];

    const buffs = currentBuffs.filter((buff) => String(buff?.itemId) === String(itemId));

    return buffs;
  }

  public async getBuffByItemKey(character: ICharacter, itemKey: string): Promise<ICharacterItemBuff | undefined> {
    const buff = (await CharacterBuff.findOne({ owner: character._id, itemKey })
      .lean()
      .cacheQuery({
        cacheKey: `characterBuff_${character._id}_${itemKey}`,
      })) as ICharacterItemBuff;

    return buff;
  }

  public async getBuff(character: ICharacter, buffId: string): Promise<ICharacterBuff | undefined> {
    const buff = (await CharacterBuff.findOne({ _id: buffId, owner: character._id })
      .lean()
      .cacheQuery({
        cacheKey: `characterBuff_${character._id}_${buffId}`,
      })) as ICharacterBuff;

    return buff;
  }

  public async deleteBuff(character: ICharacter, buffId: string): Promise<boolean> {
    try {
      await CharacterBuff.deleteOne({ _id: buffId, owner: character._id });

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  public async deleteAllCharacterBuffs(character: ICharacter, options?: ICharacterBuffDeleteOptions): Promise<boolean> {
    try {
      if (options?.deleteTemporaryOnly) {
        await CharacterBuff.deleteMany({
          owner: character._id,
          durationType: CharacterBuffDurationType.Temporary,
        });
      } else {
        await CharacterBuff.deleteMany({ owner: character._id });
      }

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
