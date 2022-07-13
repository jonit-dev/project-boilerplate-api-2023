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

  public async removeItemFromMap(item: IItem): Promise<void> {
    if (item.x === undefined || item.y === undefined || item.scene === undefined) {
      throw new Error("You cannot call this method without an item x, y and scene.");
    }

    await this.warnCharactersAboutItemRemovalInView(item, item.x, item.y, item.scene);

    // unset x, y, and scene from item model
    item.x = undefined;
    item.y = undefined;
    item.scene = undefined;
    await item.save();
  }

  public async warnCharactersAboutItemRemovalInView(item: IItem, x: number, y: number, scene: string): Promise<void> {
    if (x !== undefined && y !== undefined && scene !== undefined) {
      const charactersNearby = await this.characterView.getCharactersAroundXYPosition(x, y, scene);

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
    } else {
      throw new Error("You cannot call this method without x, y and scene");
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

      if (item.x === undefined || item.y === undefined || !item.scene || !item.layer) {
        continue;
      }

      this.socketMessaging.sendEventToUser<IItemUpdate>(character.channelId!, ItemSocketEvents.Update, {
        id: item.id,
        texturePath: item.texturePath,
        textureAtlas: item.textureAtlas,
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
