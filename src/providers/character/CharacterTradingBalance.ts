import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";

import { provide } from "inversify-binding-decorators";
import { CharacterItemSlots } from "./characterItems/CharacterItemSlots";

@provide(CharacterTradingBalance)
export class CharacterTradingBalance {
  constructor(private characterItemSlots: CharacterItemSlots) {}

  public async getTotalGoldInInventory(character: ICharacter): Promise<number> {
    const inventory = await character.inventory;
    const inventoryContainer = await ItemContainer.findById(inventory._id);

    if (!inventoryContainer) {
      throw new Error("Character inventory not found");
    }

    const totalGold = await this.characterItemSlots.getTotalQty(inventoryContainer, OthersBlueprint.GoldCoin);

    return totalGold;
  }
}
