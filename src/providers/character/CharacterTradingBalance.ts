import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { TRADER_BUY_PRICE_MULTIPLIER, TRADER_SELL_PRICE_MULTIPLIER } from "@providers/constants/ItemConstants";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { MathHelper } from "@providers/math/MathHelper";
import { ITradeRequestItem } from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";
import { CharacterItemInventory } from "./characterItems/CharacterItemInventory";
import { CharacterItemSlots } from "./characterItems/CharacterItemSlots";
import { IItem } from "@entities/ModuleInventory/ItemModel";

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

  public calculateItemsTotalPrice(
    tradingEntityItems: Partial<IItem>[],
    items: ITradeRequestItem[],
    priceMultiplier: number
  ): number {
    return items.reduce((total, item) => {
      const tradingEntityHasItem = tradingEntityItems.some((traderItem) => traderItem.key === item.key);

      if (!tradingEntityHasItem) {
        // if the trading entity (NPC or Marketplace) doesnt have an item,
        // do not take it into account into the total cost (because we won't sell it, anyway)
        return total;
      }

      return total + this.getItemBuyPrice(item.key, priceMultiplier) * item.qty!;
    }, 0);
  }

  public getItemSellPrice(key: string, priceMultiplier: number = TRADER_SELL_PRICE_MULTIPLIER): number {
    return this.getItemPrice(key, priceMultiplier);
  }

  public getItemBuyPrice(key: string, priceMultiplier: number = TRADER_BUY_PRICE_MULTIPLIER): number {
    return this.getItemPrice(key, priceMultiplier);
  }

  private getItemPrice(key: string, multiplier: number): number {
    const basePrice = itemsBlueprintIndex[key]?.basePrice ?? 0;
    return this.mathHelper.fixPrecision(basePrice * multiplier);
  }
}
