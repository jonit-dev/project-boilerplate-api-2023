import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TRADER_BUY_PRICE_MULTIPLIER, TRADER_SELL_PRICE_MULTIPLIER } from "@providers/constants/ItemConstants";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { MathHelper } from "@providers/math/MathHelper";
import { ITradeRequestItem } from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";
import { CharacterInventory } from "./CharacterInventory";
import { CharacterItemSlots } from "./characterItems/CharacterItemSlots";

@provide(CharacterTradingBalance)
export class CharacterTradingBalance {
  constructor(
    private characterItemSlots: CharacterItemSlots,
    private mathHelper: MathHelper,
    private characterInventory: CharacterInventory
  ) {}

  public async getTotalGoldInInventory(character: ICharacter): Promise<number> {
    const inventory = await this.characterInventory.getInventory(character);

    const inventoryContainer = await ItemContainer.findById(inventory?.itemContainer);

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

      return total + this.getItemBuyPrice(item.key) * item.qty!;
    }, 0);
  }

  public getItemSellPrice(key: string): number {
    return this.getItemPrice(key, TRADER_SELL_PRICE_MULTIPLIER);
  }

  public getItemBuyPrice(key: string): number {
    return this.getItemPrice(key, TRADER_BUY_PRICE_MULTIPLIER);
  }

  private getItemPrice(key: string, multiplier: number): number {
    const basePrice = itemsBlueprintIndex[key]?.basePrice ?? 0;
    return this.mathHelper.fixPrecision(basePrice * multiplier);
  }
}
