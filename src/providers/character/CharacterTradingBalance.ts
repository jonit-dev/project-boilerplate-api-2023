import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { TRADER_BUY_PRICE_MULTIPLIER, TRADER_SELL_PRICE_MULTIPLIER } from "@providers/constants/ItemConstants";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { MathHelper } from "@providers/math/MathHelper";
import { ITradeRequestItem } from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";
import { CharacterItemInventory } from "./characterItems/CharacterItemInventory";
import { CharacterItemSlots } from "./characterItems/CharacterItemSlots";

@provide(CharacterTradingBalance)
export class CharacterTradingBalance {
  constructor(
    private characterItemSlots: CharacterItemSlots,
    private mathHelper: MathHelper,
    private characterItemInventory: CharacterItemInventory
  ) {}

  public async getTotalGoldInInventory(character: ICharacter): Promise<number> {
    const items = await this.characterItemInventory.getAllItemsFromInventoryNested(character);

    const itemsQty = this.characterItemSlots.getTotalQtyByKey(items);
    const totalGold = itemsQty.get(OthersBlueprint.GoldCoin);

    return totalGold || 0;
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
