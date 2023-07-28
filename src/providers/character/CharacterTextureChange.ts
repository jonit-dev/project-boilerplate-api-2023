import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents, ICharacterAttributeChanged } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterTextureChange)
export class CharacterTextureChange {
  constructor(private inMemoryHashTable: InMemoryHashTable, private socketMessaging: SocketMessaging) {}

  private async updateCharacterTexture(id: string, textureKey: string): Promise<ICharacter> {
    return await Character.findByIdAndUpdate(id, { textureKey }, { new: true })
      .select("_id textureKey channelId")
      .lean();
  }

  public async changeTexture(
    character: ICharacter,
    textureKey: string,
    intervalInSecs: number,
    spell?: string
  ): Promise<void> {
    const namespace = spell || "spell";
    const key: string = character._id.toString();
    const normalTextureKey = character.textureKey;
    const spellType = "SpellType";

    try {
      const updatedCharacter = await this.updateCharacterTexture(character._id, textureKey);
      const payload: ICharacterAttributeChanged = this.createPayload(updatedCharacter);

      await this.socketMessaging.sendEventToCharactersAroundCharacter(
        character,
        CharacterSocketEvents.AttributeChanged,
        payload,
        true
      );
      this.socketMessaging.sendMessageToCharacter(
        character,
        `You've morphed into a ${textureKey} for ${intervalInSecs} seconds!`
      );

      let hasSpell: boolean = false;
      const spellTypeStored = await this.inMemoryHashTable.getAll("SpellType");

      if (spellTypeStored) {
        for (const spellKey of Object.keys(spellTypeStored)) {
          const spell = await this.inMemoryHashTable.has(spellKey, key);
          if (spell) {
            hasSpell = true;
            break; // break the loop if a spell is found
          }
        }
      }

      if (!hasSpell) {
        await this.inMemoryHashTable.set(namespace, key, normalTextureKey);
        // add all spell types.if it's already exists it will overwrite.
        await this.inMemoryHashTable.set(spellType, namespace, true);
      }

      setTimeout(async () => {
        const normalTextureKeyStored: unknown = await this.inMemoryHashTable.get(namespace, key);

        if (typeof normalTextureKeyStored === "string") {
          const refreshedCharacter = await this.updateCharacterTexture(updatedCharacter._id, normalTextureKeyStored);
          const refreshedPayload: ICharacterAttributeChanged = this.createPayload(refreshedCharacter);

          await this.inMemoryHashTable.delete(namespace, key);
          await this.socketMessaging.sendEventToCharactersAroundCharacter(
            character,
            CharacterSocketEvents.AttributeChanged,
            refreshedPayload,
            true
          );
        }
      }, intervalInSecs * 1000);
    } catch (error) {
      console.error(`Error in texture change: ${character._id} `, error);
    }
  }

  private createPayload(character: ICharacter): ICharacterAttributeChanged {
    return {
      targetId: character._id,
      textureKey: character.textureKey,
    };
  }

  public async removeAllTextureChange(): Promise<void> {
    try {
      const spellTypeStored = await this.inMemoryHashTable.getAll("SpellType");
      await this.inMemoryHashTable.deleteAll("SpellType");

      if (!spellTypeStored) return;

      // Iterate over properties in spellTypeStored
      for (const key of Object.keys(spellTypeStored)) {
        const spellData = await this.inMemoryHashTable.getAll(key);
        await this.inMemoryHashTable.deleteAll(key);

        if (!spellData) continue;

        // Iterating over spell data and updating character textures
        for (const spellKey of Object.keys(spellData)) {
          await this.updateCharacterTexture(spellKey, spellData[spellKey] as string);
        }
      }
    } catch (error) {
      console.error("An error occurred while removing all texture change:", error);
    }
  }
}
