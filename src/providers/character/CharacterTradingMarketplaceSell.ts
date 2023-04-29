import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  CharacterTradeSocketEvents,
  ICharacterMarketplaceTradeInitSellResponse,
  ITradeRequestItem,
  TradingEntity,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterTradingBalance } from "./CharacterTradingBalance";
import { CharacterTradingValidation } from "./CharacterTradingValidation";
import { CharacterTradingSell } from "./CharacterTradingSell";

@provide(CharacterTradingMarketplaceSell)
export class CharacterTradingMarketplaceSell {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterTradingSell: CharacterTradingSell,
    private characterTradingValidation: CharacterTradingValidation,
    private characterTradingBalance: CharacterTradingBalance
  ) {}

  public async initializeSell(marketplaceId: string, character: ICharacter): Promise<void> {
    const mp = await this.characterTradingValidation.validateAndReturnMarketplace(marketplaceId, character);
    if (!mp) {
      return;
    }

    const characterItems = await this.characterTradingSell.getCharacterItemsToSell(
      character,
      TradingEntity.Marketplace
    );
    if (!characterItems) {
      return;
    }

    const characterAvailableGold = await this.characterTradingBalance.getTotalGoldInInventory(character);

    this.socketMessaging.sendEventToUser<ICharacterMarketplaceTradeInitSellResponse>(
      character.channelId!,
      CharacterTradeSocketEvents.MarketplaceTradeInit,
      {
        marketplaceId: mp._id,
        type: "sell",
        characterItems: characterItems || [],
        characterAvailableGold,
      }
    );
  }

  public sellItems(character: ICharacter, items: ITradeRequestItem[]): Promise<void> {
    return this.characterTradingSell.sellItems(character, items, TradingEntity.Marketplace);
  }
}
