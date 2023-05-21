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

    try {
      const updatedCharacter = await this.updateCharacterTexture(character._id, textureKey);
      const payload: ICharacterAttributeChanged = this.createPayload(updatedCharacter);

      this.socketMessaging.sendEventToAllUsers(CharacterSocketEvents.AttributeChanged, payload);
      this.socketMessaging.sendMessageToCharacter(
        character,
        `You've morphed into a ${textureKey} for ${intervalInSecs} seconds!`
      );

      await this.inMemoryHashTable.set(namespace, key, normalTextureKey);

      setTimeout(async () => {
        const normalTextureKeyStored: unknown = await this.inMemoryHashTable.get(namespace, key);

        if (typeof normalTextureKeyStored === "string") {
          const refreshedCharacter = await this.updateCharacterTexture(updatedCharacter._id, normalTextureKeyStored);
          const refreshedPayload: ICharacterAttributeChanged = this.createPayload(refreshedCharacter);

          await this.inMemoryHashTable.delete(namespace, key);
          this.socketMessaging.sendEventToAllUsers(CharacterSocketEvents.AttributeChanged, refreshedPayload);
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
}
