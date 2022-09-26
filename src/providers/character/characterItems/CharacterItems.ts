import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { OperationStatus } from "@providers/types/ValidationTypes";
import { ItemSlotType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterItemEquipment } from "./CharacterItemEquipment";
import { CharacterItemInventory } from "./CharacterItemInventory";

export interface ICharacterItemResult {
  status: OperationStatus;
  message?: string;
}

@provide(CharacterItems)
export class CharacterItems {
  constructor(
    private characterItemInventory: CharacterItemInventory,
    private characterItemEquipment: CharacterItemEquipment
  ) {}

  public async createItem(
    itemBlueprintKey: string,
    character: ICharacter,
    container: "inventory" | "equipment",
    slot?: ItemSlotType
  ): Promise<ICharacterItemResult> {
    switch (container) {
      case "inventory":
        return await this.createItemInInventory(itemBlueprintKey, character);
      // case "equipment":
      //   return await this.createItemInEquipment(itemBlueprintKey, character);

      default:
        return {
          status: OperationStatus.Error,
          message: "Something went wrong while trying to create your inventory item.",
        };
    }
  }

  private async createItemInInventory(itemBlueprintKey: string, character: ICharacter): Promise<ICharacterItemResult> {
    const itemBlueprint = itemsBlueprintIndex[itemBlueprintKey];

    if (!itemBlueprint) {
      console.log("Item blueprint not found");
      return {
        status: OperationStatus.Error,
        message: "Item blueprint not found",
      };
    }

    try {
      const item = await Item.create({
        ...itemBlueprint,
      });

      await item.save();

      return {
        status: OperationStatus.Success,
      };
    } catch (error) {
      console.error(error);
    }

    return {
      status: OperationStatus.Error,
      message: "Something went wrong while trying to create your inventory item.",
    };
  }

  //! Warning: This completely WIPES OUT the item from the inventory or equipment. It DOES NOT DROP IT. Once it's executed, it's gone! If you want to drop an item, check ItemDrop.ts
  public async deleteItem(
    itemId: string,
    character: ICharacter,
    container: "inventory" | "equipment" | "both"
  ): Promise<ICharacterItemResult> {
    switch (container) {
      case "inventory":
        return await this.characterItemInventory.deleteItemFromInventory(itemId, character);
      case "equipment":
        return await this.characterItemEquipment.deleteItemFromEquipment(itemId, character);
      case "both":
        return (
          (await this.characterItemInventory.deleteItemFromInventory(itemId, character)) ||
          (await this.characterItemEquipment.deleteItemFromEquipment(itemId, character))
        );
      default:
        return {
          status: OperationStatus.Error,
          message: `"Something went wrong while trying to delete your ${container} item."`,
        };
    }
  }

  public async hasItem(
    itemId: string,
    character: ICharacter,
    container: "inventory" | "equipment" | "both"
  ): Promise<boolean> {
    switch (container) {
      case "inventory":
        return await this.characterItemInventory.checkItemInInventory(itemId, character);
      case "equipment":
        return await this.characterItemEquipment.checkItemEquipment(itemId, character);
      case "both":
        return (
          (await this.characterItemInventory.checkItemInInventory(itemId, character)) ||
          (await this.characterItemEquipment.checkItemEquipment(itemId, character))
        );
      default:
        return false;
    }
  }
}
