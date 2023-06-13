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
  public async addBuff(characterId: string, buff: ICharacterBuff): Promise<ICharacterBuff | undefined> {
    try {
      const newCharacterBuff = new CharacterBuff({
        owner: characterId,
        ...buff,
      });

      await newCharacterBuff.save();

      await clearCacheForKey(`characterBuffs_${characterId}`);

      if (newCharacterBuff.itemKey) {
        await clearCacheForKey(`characterBuff_${characterId}_${newCharacterBuff.itemKey}`);
      }

      return newCharacterBuff as ICharacterBuff;
    } catch (error) {
      console.error(error);
    }
  }

  public async getAllCharacterBuffs(characterId: string): Promise<ICharacterBuff[]> {
    const allCharacterBuffs = (await CharacterBuff.find({ owner: characterId })
      .lean()
      .cacheQuery({
        cacheKey: `characterBuffs_${characterId}`,
      })) as ICharacterBuff[];

    return allCharacterBuffs;
  }

  public async getAllBuffAbsoluteChanges(characterId: string, trait: CharacterTrait): Promise<number> {
    const characterBuffs = await this.getAllCharacterBuffs(characterId);

    const buffs = characterBuffs.filter((buff) => buff.trait === trait);

    if (!buffs) {
      return 0;
    }

    return buffs.reduce((acc, buff) => acc + buff.absoluteChange!, 0);
  }

  public async getBuffByItemId(characterId: string, itemId: string): Promise<ICharacterItemBuff[]> {
    const currentBuffs = (await this.getAllCharacterBuffs(characterId)) as ICharacterItemBuff[];

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

  public async getBuff(characterId: string, buffId: string): Promise<ICharacterBuff | undefined> {
    const buff = (await CharacterBuff.findOne({ _id: buffId, owner: characterId })
      .lean()
      .cacheQuery({
        cacheKey: `characterBuff_${characterId}_${buffId}`,
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
