import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterView } from "@providers/character/CharacterView";
import { DataStructureHelper } from "@providers/dataStructures/DataStructuresHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import { IItemsInView, IItemUpdate, ItemSocketEvents, ItemSubType, ItemType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemView)
export class ItemView {
  constructor(
    private characterView: CharacterView,
    private socketMessaging: SocketMessaging,
    private objectHelper: DataStructureHelper,
    private socketTransmissionZone: SocketTransmissionZone
  ) {}

  public async warnCharacterAboutItemsInView(character: ICharacter, otherItemsInView?: IItemsInView): Promise<void> {
    const itemsNearby = await this.getItemsInCharacterView(character);

    for (const item of itemsNearby) {
      // if we already have this item in the character view, with an updated payload, just skip it!

      const itemOnCharView = character.view.items[item.id];

      // if we already have a representation there, just skip!
      if (itemOnCharView && this.objectHelper.doesObjectAttrMatches(itemOnCharView, item, ["id", "x", "y", "scene"])) {
        continue;
      }

      if (!item.x || !item.y || !item.scene || !item.layer) {
        continue;
      }

      this.socketMessaging.sendEventToUser<IItemUpdate>(character.channelId!, ItemSocketEvents.Update, {
        id: item.id,
        textureKey: item.textureKey,
        type: item.type as ItemType,
        subType: item.subType as ItemSubType,
        name: item.name,
        x: item.x,
        y: item.y,
        scene: item.scene,
        layer: item.layer,
      });

      await this.characterView.addToCharacterView(
        character,
        {
          id: item.id,
          x: item.x,
          y: item.y,
          scene: item.scene,
        },
        "items"
      );
    }
  }

  public async getItemsInCharacterView(character: ICharacter): Promise<IItem[]> {
    const itemsInView = await this.characterView.getElementsInCharView(Item, character);

    return itemsInView;
  }
}
