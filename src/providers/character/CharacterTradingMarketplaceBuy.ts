import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import Shared, {
  CharacterTradeSocketEvents,
  ICharacterMarketplaceTradeInitBuyResponse,
  ITradeRequestItem,
  ITradeResponseItem,
  TradingEntity,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterTradingBalance } from "./CharacterTradingBalance";
import { CharacterTradingValidation } from "./CharacterTradingValidation";
import { MARKETPLACE_BUY_PRICE_MULTIPLIER } from "@providers/constants/ItemConstants";
import { IMarketplace } from "@entities/ModuleMarketplace/MarketplaceModel";
import { CharacterTradingBuy } from "./CharacterTradingBuy";

@provide(CharacterTradingMarketplaceBuy)
export class CharacterTradingMarketplaceBuy {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterTradingBalance: CharacterTradingBalance,
    private characterTradingBuy: CharacterTradingBuy,
    private characterTradingValidation: CharacterTradingValidation
  ) {}

  public async initializeBuy(marketplaceId: string, character: ICharacter): Promise<void> {
    const mp = await this.characterTradingValidation.validateAndReturnMarketplace(marketplaceId, character);
    if (!mp) {
      return;
    }
    const marketplaceItems: ITradeResponseItem[] = [];

    mp.items?.forEach(({ key }) => {
      const item = itemsBlueprintIndex[key] as Shared.IItem;
      const price = this.characterTradingBalance.getItemBuyPrice(key, MARKETPLACE_BUY_PRICE_MULTIPLIER);

      if (price) {
        marketplaceItems.push({ ...item, price });
      }
    });

    const characterAvailableGold = await this.characterTradingBalance.getTotalGoldInInventory(character);

    this.socketMessaging.sendEventToUser<ICharacterMarketplaceTradeInitBuyResponse>(
      character.channelId!,
      CharacterTradeSocketEvents.MarketplaceTradeInit,
      {
        marketplaceId: mp._id,
        type: "buy",
        items: marketplaceItems,
        characterAvailableGold,
      }
    );
  }

  public buyItems(character: ICharacter, marketplace: IMarketplace, items: ITradeRequestItem[]): Promise<boolean> {
    return this.characterTradingBuy.buyItems(character, marketplace, items, TradingEntity.Marketplace);
  }
}
