import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";

import { provide } from "inversify-binding-decorators";
import { CharacterItemEquipment } from "./CharacterItemEquipment";
import { CharacterItemInventory } from "./CharacterItemInventory";

@provide(CharacterItems)
export class CharacterItems {
  constructor(
    private characterItemInventory: CharacterItemInventory,
    private characterItemEquipment: CharacterItemEquipment
  ) {}

  //! Warning: This completely WIPES OUT the item from the inventory or equipment. It DOES NOT DROP IT. Once it's executed, it's gone! If you want to drop an item, check ItemDrop.ts
  public async deleteItemFromContainer(
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
