import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { ICharacterItemBuff } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterBuffActivator } from "./CharacterBuffActivator";
import { CharacterBuffTracker } from "./CharacterBuffTracker";

@provide(CharacterItemBuff)
export class CharacterItemBuff {
  constructor(
    private characterBuff: CharacterBuffActivator,
    private characterBuffTracker: CharacterBuffTracker,
    private socketMessaging: SocketMessaging
  ) {}

  public async enableItemBuff(character: ICharacter, item: IItem): Promise<void> {
    const itemBlueprint = itemsBlueprintIndex[item.baseKey];

    if (!itemBlueprint || !itemBlueprint.equippedBuff) {
      return;
    }

    const equippedBuffs = Array.isArray(itemBlueprint.equippedBuff)
      ? itemBlueprint.equippedBuff
      : [itemBlueprint.equippedBuff];

    try {
      const messages: string[] = await Promise.all(
        equippedBuffs.map(async (buff) => {
          const buffData: ICharacterItemBuff = {
            ...buff,
            itemId: item._id,
            itemKey: item.baseKey,
          };

          await this.characterBuff.enablePermanentBuff(character, buffData, true);
          return buffData.options?.messages?.activation || "";
        })
      );

      this.socketMessaging.sendMessageToCharacter(character, messages.join(" "));
    } catch (error) {
      console.error(`An error occurred while enabling the buff: ${error}`);
    }
  }

  public async disableItemBuff(character: ICharacter, itemId: string): Promise<void> {
    try {
      const itemBuffs = await this.characterBuffTracker.getBuffByItemId(character, itemId);

      if (itemBuffs.length === 0) {
        return;
      }

      const messages: string[] = await Promise.all(
        itemBuffs.map(async (buff) => {
          if (!buff._id) {
            throw new Error(`Buff id is null or undefined for item id: ${itemId}`);
          }

          await this.characterBuff.disableBuff(character, buff._id, buff.type, true);
          return buff.options?.messages?.deactivation || "";
        })
      );

      this.socketMessaging.sendMessageToCharacter(character, messages.join(" "));
    } catch (err) {
      console.error(err);
    }
  }
}
