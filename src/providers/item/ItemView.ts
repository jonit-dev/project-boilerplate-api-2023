import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterView } from "@providers/character/CharacterView";
import { DataStructureHelper } from "@providers/dataStructures/DataStructuresHelper";
import { IWarnOptions } from "@providers/npc/NPCWarn";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IItemUpdate,
  IItemUpdateAll,
  IViewDestroyElementPayload,
  ItemSocketEvents,
  ItemSubType,
  ItemType,
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

  public async removeItemFromMap(item: IItem): Promise<boolean> {
    try {
      if (item.x === undefined || item.y === undefined || item.scene === undefined) {
        return false;
      }

      await this.warnCharactersAboutItemRemovalInView(item, item.x, item.y, item.scene);

      // unset x, y, and scene from item model
      await Item.updateOne(
        {
          _id: item.id,
        },
        {
          x: undefined,
          y: undefined,
          scene: undefined,
        }
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async addItemToMap(item: IItem, x: number, y: number, scene: string): Promise<void> {
    if (x === undefined || y === undefined || scene === undefined) {
      throw new Error("You cannot call this method without an item x, y and scene.");
    }

    await Item.updateOne(
      {
        _id: item.id,
      },
      {
        x,
        y,
        scene,
      }
    );
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

  public async warnCharacterAboutItemsInView(character: ICharacter, options?: IWarnOptions): Promise<void> {
    const itemsNearby = await this.getItemsInCharacterView(character);
    const itemsToUpdate: IItemUpdate[] = [];

    for (const item of itemsNearby) {
      // if we already have this item in the character view, with an updated payload, just skip it!

      const itemOnCharView = await this.characterView.getElementOnView(character, item._id, "items");

      if (!options?.always) {
        // if we already have a representation there, just skip!
        if (
          itemOnCharView &&
          this.objectHelper.doesObjectAttrMatches(itemOnCharView, item, ["id", "x", "y", "scene", "isDeadBodyLootable"])
        ) {
          continue;
        }
      }

      if (item.x === undefined || item.y === undefined || !item.scene || !item.layer) {
        continue;
      }

      itemsToUpdate.push({
        id: item.id,
        texturePath: item.texturePath,
        textureAtlas: item.textureAtlas,
        type: item.type as ItemType,
        subType: item.subType as ItemSubType,
        name: item.name,
        x: item.x,
        y: item.y,
        layer: item.layer,
        stackQty: item.stackQty || 0,
        isDeadBodyLootable: item.isDeadBodyLootable,
      });

      await this.characterView.addToCharacterView(
        character,
        {
          id: item.id,
          x: item.x,
          y: item.y,
          scene: item.scene,
          isDeadBodyLootable: item.isDeadBodyLootable,
        },
        "items"
      );
    }

    // send all updates in a single message
    if (itemsToUpdate.length === 0) return;

    this.socketMessaging.sendEventToUser<IItemUpdateAll>(character.channelId!, ItemSocketEvents.UpdateAll, {
      items: itemsToUpdate,
    });
  }

  public async getItemsInCharacterView(character: ICharacter): Promise<IItem[]> {
    const itemsInView = await this.characterView.getElementsInCharView(Item, character);

    return itemsInView;
  }
}
