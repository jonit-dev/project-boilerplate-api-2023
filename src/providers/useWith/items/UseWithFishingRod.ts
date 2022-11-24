import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { CraftingResourcesBlueprint, FoodsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentAndInventoryUpdatePayload, IItemContainer, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { random } from "lodash";
import { IUseWithTargetTile } from "../useWithTypes";

@provide(UseWithFishingRod)
export class UseWithFishingRod {
  constructor(
    private animationEffect: AnimationEffect,
    private characterItemInventory: CharacterItemInventory,
    private socketMessaging: SocketMessaging,
    private characterItemContainer: CharacterItemContainer
  ) {}

  public async execute(character: ICharacter, targetTile: IUseWithTargetTile): Promise<void> {
    // consume one worm from inventory

    const hasWorm = await this.characterItemInventory.checkItemInInventoryByKey(
      CraftingResourcesBlueprint.Worm,
      character
    );

    if (!hasWorm) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Sorry, you need a worm to fish.");
      return;
    }

    const decrementWorm = await this.characterItemInventory.decrementItemFromInventory(
      CraftingResourcesBlueprint.Worm,
      character,
      1
    );

    if (!decrementWorm) {
      this.socketMessaging.sendErrorMessageToCharacter(character);
      return;
    }

    await this.animationEffect.sendAnimationEventToXYPosition(character, "fishing", targetTile.x, targetTile.y);

    // if everything is allright, calculate a chance

    const n = random(0, 100);

    if (n < 50) {
      // TODO: Add skill influence here

      // if the chance is successful, spawn a fish item on the inventory

      const addedFishToBackpack = await this.addFishToBackpack(character);

      if (addedFishToBackpack) {
        await this.refreshInventory(character);
      }
    } else {
      const randomMissMessage = [
        "Hmm... Nothing here.",
        "You didn't catch anything.",
        "You didn't catch anything. Try again.",
        "Oops! The fish got away.",
      ];

      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        randomMissMessage[random(0, randomMissMessage.length - 1)]
      );

      await this.refreshInventory(character);
    }
  }

  private async addFishToBackpack(character: ICharacter): Promise<boolean> {
    const itemBlueprint = itemsBlueprintIndex[FoodsBlueprint.WildSalmon];

    const fish = new Item({
      ...itemBlueprint,
      stackQty: random(1, 3),
    });
    await fish.save();
    const inventory = await character.inventory;

    const inventoryContainerId = inventory.itemContainer as unknown as string;

    // add it to the character's inventory
    return await this.characterItemContainer.addItemToContainer(fish, character, inventoryContainerId);
  }

  private async refreshInventory(character: ICharacter): Promise<void> {
    const inventory = await character.inventory;
    const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: inventoryContainer,
      openEquipmentSetOnUpdate: false,
      openInventoryOnUpdate: true,
    };

    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }
}
