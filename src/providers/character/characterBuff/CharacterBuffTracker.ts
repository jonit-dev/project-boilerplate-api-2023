import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { ICharacterBuff, ICharacterItemBuff } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { v4 as uuidv4 } from "uuid";

interface ICharacterBuffDeleteOptions {
  deleteTemporaryOnly?: boolean;
}

@provide(CharacterBuffTracker)
export class CharacterBuffTracker {
  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async addBuff(character: ICharacter, buff: ICharacterBuff): Promise<string | undefined> {
    const newBuffId = uuidv4();

    buff._id = newBuffId;

    try {
      const currentBuffs = (await this.inMemoryHashTable.get("character-buffs", character._id)) as ICharacterBuff[];

      if (!currentBuffs) {
        await this.inMemoryHashTable.set("character-buffs", character._id, [buff]);
        return buff._id;
      }

      await this.inMemoryHashTable.set("character-buffs", character._id, [...currentBuffs, buff]);

      return buff._id;
    } catch (error) {
      console.error(error);
    }
  }

  public async getAllCharacterBuffs(character: ICharacter): Promise<ICharacterBuff[]> {
    const currentBuffs = (await this.inMemoryHashTable.get("character-buffs", character._id)) as ICharacterBuff[];

    if (!currentBuffs) {
      return [];
    }

    return currentBuffs;
  }

  public async getBuff(character: ICharacter, buffId: string): Promise<ICharacterBuff | undefined> {
    const currentBuffs = (await this.inMemoryHashTable.get("character-buffs", character._id)) as ICharacterBuff[];

    if (!currentBuffs) {
      return undefined;
    }

    return currentBuffs.find((buff) => buff._id === buffId);
  }

  public async getBuffByItemId(character: ICharacter, itemId: string): Promise<ICharacterItemBuff | undefined> {
    const currentBuffs = (await this.getAllCharacterBuffs(character)) as ICharacterItemBuff[];

    const buff = currentBuffs.find((buff) => String(buff?.itemId) === String(itemId));

    return buff;
  }

  public async getBuffByItemKey(character: ICharacter, itemKey: string): Promise<ICharacterItemBuff | undefined> {
    const currentBuffs = (await this.inMemoryHashTable.get("character-buffs", character._id)) as ICharacterItemBuff[];

    if (!currentBuffs) {
      return undefined;
    }

    const buff = currentBuffs.find((buff) => String(buff?.itemKey) === String(itemKey));

    return buff;
  }

  public async deleteBuff(character: ICharacter, buffId: string): Promise<boolean> {
    try {
      const currentBuffs = (await this.inMemoryHashTable.get("character-buffs", character._id)) as ICharacterBuff[];

      if (!currentBuffs) {
        return false;
      }

      const updatedBuffs = currentBuffs.filter((buff) => buff._id !== buffId);

      await this.inMemoryHashTable.set("character-buffs", character._id, updatedBuffs);

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }

  public async deleteAllCharacterBuffs(character: ICharacter, options?: ICharacterBuffDeleteOptions): Promise<boolean> {
    try {
      if (options?.deleteTemporaryOnly) {
        const characterBuffs = await this.getAllCharacterBuffs(character);

        const updatedBuffs = characterBuffs.filter((buff) => buff.durationType !== "temporary");

        await this.inMemoryHashTable.set("character-buffs", character._id, updatedBuffs);

        return true;
      }

      await this.inMemoryHashTable.delete("character-buffs", character._id);

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
