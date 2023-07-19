import { CharacterBuff } from "@entities/ModuleCharacter/CharacterBuffModel";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterBuffDurationType, CharacterTrait, ICharacterBuff, ICharacterItemBuff } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { clearCacheForKey } from "speedgoose";
interface ICharacterBuffDeleteOptions {
  deleteTemporaryOnly?: boolean;
}

@provide(CharacterBuffTracker)
export class CharacterBuffTracker {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  @TrackNewRelicTransaction()
  public async addBuff(characterId: string, buff: ICharacterBuff): Promise<ICharacterBuff | undefined> {
    try {
      const newCharacterBuff = new CharacterBuff({
        owner: characterId,
        ...buff,
      });

      await newCharacterBuff.save();

      await this.clearCache({ _id: characterId } as ICharacter);

      return newCharacterBuff as ICharacterBuff;
    } catch (error) {
      console.error(error);
    }
  }

  @TrackNewRelicTransaction()
  public async getAllCharacterBuffs(characterId: string): Promise<ICharacterBuff[]> {
    // cacheQuery dose not work
    const allCharacterBuffs = (await CharacterBuff.find({ owner: characterId })
      .lean()
      .cacheQuery({
        cacheKey: `characterBuffs_${characterId}`,
      })) as ICharacterBuff[];

    return allCharacterBuffs;
  }

  @TrackNewRelicTransaction()
  public async getAllBuffAbsoluteChanges(characterId: string, trait: CharacterTrait): Promise<number> {
    const characterBuffs = await this.getAllCharacterBuffs(characterId);

    const buffs = characterBuffs.filter((buff) => buff.trait === trait);

    if (!buffs) {
      return 0;
    }

    return buffs.reduce((acc, buff) => acc + buff.absoluteChange!, 0);
  }

  @TrackNewRelicTransaction()
  public async getBuffByItemId(characterId: string, itemId: string): Promise<ICharacterItemBuff[]> {
    const currentBuffs = (await this.getAllCharacterBuffs(characterId)) as ICharacterItemBuff[];

    const buffs = currentBuffs.filter((buff) => String(buff?.itemId) === String(itemId));

    return buffs;
  }

  public async getBuffByItemKey(character: ICharacter, itemKey: string): Promise<ICharacterItemBuff | undefined> {
    const buff = (await CharacterBuff.findOne({ owner: character._id, itemKey }).lean()) as ICharacterItemBuff;

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

      await this.clearCache(character);

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

  private async clearCache(character: ICharacter): Promise<void> {
    await clearCacheForKey(`characterBuffs_${character._id}`);
    await clearCacheForKey(`${character._id}-skills`);
    await this.inMemoryHashTable.delete(character._id.toString(), "totalAttack");
    await this.inMemoryHashTable.delete(character._id.toString(), "totalDefense");
  }
}
