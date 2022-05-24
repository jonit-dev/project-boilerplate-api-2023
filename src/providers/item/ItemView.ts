import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterView } from "@providers/character/CharacterView";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IItemsInView, IItemUpdate, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemView)
export class ItemView {
  constructor(private characterView: CharacterView, private socketMessaging: SocketMessaging) {}

  public async warnCharacterAboutItemsInView(character: ICharacter, otherItemsInView?: IItemsInView): Promise<void> {
    const itemsNearby = await this.getItemsInCharacterView(character);

    for (const item of itemsNearby) {
      // if we already have this item in the character view, with an updated payload, just skip it!
      if (otherItemsInView && otherItemsInView[item.id]) {
        if (otherItemsInView[item.id].x === item.x && otherItemsInView[item.id].y === item.y) {
          continue;
        }
      }

      if (!item.x || !item.y || !item.scene || !item.layer) {
        continue;
      }

      this.socketMessaging.sendEventToUser<IItemUpdate>(character.channelId!, ItemSocketEvents.Update, {
        id: item.id,
        textureKey: item.textureKey,
        name: item.name,
        x: item.x,
        y: item.y,
        scene: item.scene,
        layer: item.layer,
      });
    }
  }

  public async getItemsInCharacterView(character: ICharacter): Promise<IItem[]> {
    const itemsInView = await this.characterView.getElementsInCharView(Item, character);

    return itemsInView;
  }
}
