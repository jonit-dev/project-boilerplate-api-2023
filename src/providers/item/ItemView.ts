import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterView } from "@providers/character/CharacterView";
import { DataStructureHelper } from "@providers/dataStructures/DataStructuresHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IItemUpdate,
  ItemSocketEvents,
  ItemSubType,
  ItemType,
  IViewDestroyElementPayload,
  ViewSocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemView)
export class ItemView {
  constructor(
    private characterView: CharacterView,
    private socketMessaging: SocketMessaging,
    private objectHelper: DataStructureHelper
  ) {}

  public async warnCharacterAboutItemRemovalInView(item: IItem): Promise<void> {
    if (item.x && item.y && item.scene) {
      const charactersNearby = await this.characterView.getCharactersAroundXYPosition(item.x, item.y, item.scene);

      for (const character of charactersNearby) {
        this.socketMessaging.sendEventToUser<IViewDestroyElementPayload>(
          character.channelId!,
          ViewSocketEvents.Destroy,
          {
            id: item.id,
            type: "items",
          }
        );

        await this.characterView.removeFromCharacterView(character, item.id, "items");
      }
    }
  }

  public async warnCharacterAboutItemsInView(character: ICharacter): Promise<void> {
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
