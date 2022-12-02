import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { CraftingResourcesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentAndInventoryUpdatePayload, IItemContainer, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { random } from "lodash";
import { IUseWithTargetTile } from "../useWithTypes";

@provide(UseWithPickaxe)
export class UseWithPickaxe {
  constructor(
    private animationEffect: AnimationEffect,
    private socketMessaging: SocketMessaging,
    private characterItemContainer: CharacterItemContainer
  ) {}

  public async execute(character: ICharacter, targetTile: IUseWithTargetTile): Promise<void> {
    const n = random(0, 100);

    await this.animationEffect.sendAnimationEventToXYPosition(character, "mining", targetTile.x, targetTile.y);

    if (n < 30) {
      // TODO: Add skill influence here

      // if the chance is successful, spawn a iron ingot item on the inventory

      const addedIronToBackpack = await this.addIronToBackpack(character);

      if (addedIronToBackpack) {
        await this.refreshInventory(character);
      }
    }
  }

  private async addIronToBackpack(character: ICharacter): Promise<boolean> {
    const itemBlueprint = itemsBlueprintIndex[CraftingResourcesBlueprint.IronIngot];
    const iron = new Item({
      ...itemBlueprint,
      stackQty: 1,
    });
    await iron.save();
    const inventory = await character.inventory;

    const inventoryContainerId = inventory.itemContainer as unknown as string;

    // add it to the character's inventory
    return await this.characterItemContainer.addItemToContainer(iron, character, inventoryContainerId);
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
