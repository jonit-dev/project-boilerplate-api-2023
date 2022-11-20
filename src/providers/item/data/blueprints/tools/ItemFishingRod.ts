import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { container } from "@providers/inversify/container";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IItemUseWithEntity, IUseWithTargetTile } from "@providers/useWith/useWithTypes";
import {
  IEquipmentAndInventoryUpdatePayload,
  IItemContainer,
  ItemSocketEvents,
  ItemSubType,
  ItemType,
} from "@rpg-engine/shared";
import random from "lodash/random";
import { itemsBlueprintIndex } from "../../index";
import { CraftingResourcesBlueprint, FoodsBlueprint, ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFishingRod: Partial<IItemUseWithEntity> = {
  key: ToolsBlueprint.FishingRod,
  type: ItemType.Tool,
  subType: ItemSubType.Tool,
  textureAtlas: "items",
  texturePath: "tools/fishing-rod.png",
  name: "Fishing Rod",
  description: "A tool primarily used to catch fish. It requires a worm as bait to be effective.",
  weight: 0.25,
  hasUseWith: true,
  basePrice: 70,
  useWithMaxDistanceGrid: 7,
  useWithTileEffect: async (
    originItem: IItem,
    targetTile: IUseWithTargetTile,
    character: ICharacter
  ): Promise<void> => {
    const animationEffect = container.get<AnimationEffect>(AnimationEffect);
    const characterItemInventory = container.get<CharacterItemInventory>(CharacterItemInventory);
    const socketMessaging = container.get<SocketMessaging>(SocketMessaging);
    const characterItemContainer = container.get<CharacterItemContainer>(CharacterItemContainer);

    const refreshInventory = async (): Promise<void> => {
      const inventory = await character.inventory;
      const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

      const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
        inventory: inventoryContainer,
        openEquipmentSetOnUpdate: false,
        openInventoryOnUpdate: true,
      };

      socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
        character.channelId!,
        ItemSocketEvents.EquipmentAndInventoryUpdate,
        payloadUpdate
      );
    };

    console.log("EXECUTING FISHING ROD! ");

    // consume one worm from inventory

    //! BUG, this is always returning true!
    const decrementWorm = await characterItemInventory.decrementItemFromInventory(
      CraftingResourcesBlueprint.Worm,
      character,
      1
    );

    if (!decrementWorm) {
      socketMessaging.sendErrorMessageToCharacter(character, "You need a worm to fish!");
      return;
    }

    // if everything is allright, calculate a chance

    const n = random(0, 100);

    if (n < 50) {
      console.log("Spawning new fish");
      // TODO: Add skill influence here

      // if the chance is successful, spawn a fish item on the inventory

      const itemBlueprint = itemsBlueprintIndex[FoodsBlueprint.WildSalmon];

      const fish = new Item({
        ...itemBlueprint,
        stackQty: random(1, 3),
      });
      await fish.save();
      const inventory = await character.inventory;

      const inventoryContainerId = inventory.itemContainer as unknown as string;

      // add it to the character's inventory
      const wasItemAddedToContainer = await characterItemContainer.addItemToContainer(
        fish,
        character,
        inventoryContainerId
      );

      if (wasItemAddedToContainer) {
        await animationEffect.sendAnimationEventToXYPosition(character, "fishing", targetTile.x, targetTile.y);

        await refreshInventory();
      }
    } else {
      const randomMissMessage = [
        "Hmm... Nothing here.",
        "You didn't catch anything.",
        "You didn't catch anything. Try again.",
        "Oops! The fish got away.",
      ];

      socketMessaging.sendErrorMessageToCharacter(
        character,
        randomMissMessage[random(0, randomMissMessage.length - 1)]
      );

      await refreshInventory();
    }
  },
};
