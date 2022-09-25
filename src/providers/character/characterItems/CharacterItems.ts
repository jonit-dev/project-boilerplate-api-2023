import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { ItemSlotType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterItemEquipment } from "./CharacterItemEquipment";
import { CharacterItemInventory } from "./CharacterItemInventory";

export interface ICharacterItemError {
  error: string;
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
  ): Promise<boolean> {
    switch (container) {
      case "inventory":
        return await this.createItemInInventory(itemBlueprintKey, character);
      // case "equipment":
      //   return await this.createItemInEquipment(itemBlueprintKey, character);

      default:
        return false;
    }
  }

  private async createItemInInventory(itemBlueprintKey: string, character: ICharacter): Promise<boolean> {
    const itemBlueprint = itemsBlueprintIndex[itemBlueprintKey];

    if (!itemBlueprint) {
      console.log("Item blueprint not found");
      return false;
    }

    try {
      const item = await Item.create({
        ...itemBlueprint,
      });

      await item.save();

      return true;
    } catch (error) {
      console.error(error);
    }

    return false;
  }

  //! Warning: This completely WIPES OUT the item from the inventory or equipment. It DOES NOT DROP IT. Once it's executed, it's gone! If you want to drop an item, check ItemDrop.ts
  public async deleteItem(
    itemId: string,
    character: ICharacter,
    container: "inventory" | "equipment" | "both"
  ): Promise<boolean> {
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
        return false;
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
