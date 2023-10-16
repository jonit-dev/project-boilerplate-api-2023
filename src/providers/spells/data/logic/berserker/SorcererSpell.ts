import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents, ICharacterAttributeChanged, SpellsBlueprint } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NamespaceRedisControl } from "../../types/SpellsBlueprintTypes";

@provide(SorcererSpells)
export class SorcererSpells {
  constructor(private inMemoryHashTable: InMemoryHashTable, private socketMessaging: SocketMessaging) {}

  @TrackNewRelicTransaction()
  public async handleVeilofUndeath(character: ICharacter, textureKey: string, intervalInSecs: number): Promise<void> {
    const namespace = `${NamespaceRedisControl.CharacterSpell}:${character._id}`;
    const key: SpellsBlueprint = SpellsBlueprint.SorcererVeilofUndeath;

    const normalTextureKey = character.textureKey;

    try {
      const updatedCharacter = (await Character.findByIdAndUpdate(
        character._id,
        {
          textureKey,
        },
        {
          new: true,
        }
      )
        .select("_id textureKey channelId")
        .lean()) as ICharacter;

      const payload: ICharacterAttributeChanged = {
        targetId: updatedCharacter._id,
        textureKey: updatedCharacter.textureKey,
      };

      this.socketMessaging.sendEventToUser(
        updatedCharacter.channelId!,
        CharacterSocketEvents.AttributeChanged,
        payload
      );

      await this.inMemoryHashTable.set(namespace, key, normalTextureKey);

      setTimeout(async () => {
        const normalTextureKey = await this.inMemoryHashTable.get(namespace, key);

        if (normalTextureKey) {
          const refreshCharacter = (await Character.findByIdAndUpdate(
            updatedCharacter._id,
            {
              textureKey: normalTextureKey.toString(),
            },
            {
              new: true,
            }
          )
            .select("_id textureKey channelId")
            .lean()) as ICharacter;

          const payload: ICharacterAttributeChanged = {
            targetId: refreshCharacter._id,
            textureKey: refreshCharacter.textureKey,
          };

          await this.inMemoryHashTable.delete(namespace, key);
          this.socketMessaging.sendEventToUser(
            refreshCharacter.channelId!,
            CharacterSocketEvents.AttributeChanged,
            payload
          );
        }
      }, intervalInSecs * 1000);
    } catch (error) {
      console.error(`Error in Veil of Undeath: ${character._id} `, error);
    }
  }
}
