import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ITradeRequestItem } from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";
import { CharacterItemSlots } from "./characterItems/CharacterItemSlots";

@provide(CharacterTradingBalance)
export class CharacterTradingBalance {
  constructor(private characterItemSlots: CharacterItemSlots) {}

  public async getTotalGoldInInventory(character: ICharacter): Promise<number> {
    const inventory = await character.inventory;
    const inventoryContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryContainer) {
      throw new Error("Character inventory not found");
    }

    const totalGold = await this.characterItemSlots.getTotalQty(inventoryContainer, OthersBlueprint.GoldCoin);

    return totalGold;
  }

  public calculateItemsTotalPrice(npc: INPC, items: ITradeRequestItem[]): number {
    return items.reduce((total, item) => {
      const npcHasItem = npc?.traderItems?.some((traderItem) => traderItem.key === item.key);

      if (!npcHasItem) {
        // if NPC doesnt have an item, do not take it into account into the total cost (because we won't sell it, anyway)
        return total;
      }

      const traderItem = npc.traderItems?.find((traderItem) => traderItem.key === item.key);

      return total + traderItem?.price! * item.qty!;
    }, 0);
  }
}
