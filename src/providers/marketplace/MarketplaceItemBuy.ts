import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { MarketplaceItem } from "@entities/ModuleMarketplace/MarketplaceItemModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";
import { MarketplaceValidation } from "./MarketplaceValidation";
import { CharacterTradingMarketplaceBuy } from "@providers/character/CharacterTradingMarketplaceBuy";
import { MarketplaceSocketEvents } from "@rpg-engine/shared";

@provide(MarketplaceItemBuy)
export class MarketplaceItemBuy {
  constructor(
    private socketMessaging: SocketMessaging,
    private marketplaceValidation: MarketplaceValidation,
    private characterTradingMarketplaceBuy: CharacterTradingMarketplaceBuy
  ) {}

  public async buyItemFromMarketplace(
    character: ICharacter,
    npcId: string,
    marketPlaceItemId: string
  ): Promise<boolean> {
    const marketplaceValid = await this.marketplaceValidation.hasBasicValidation(character, npcId);
    if (!marketplaceValid) {
      return false;
    }

    const marketplaceItem = await MarketplaceItem.findById(marketPlaceItemId).populate("item").exec();
    if (!marketplaceItem || marketplaceItem.isBeingBought) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        `MarketplaceItem with id ${marketPlaceItemId} does not exist`
      );
      return false;
    }

    if (marketplaceItem.owner?.toString() === character._id.toString()) {
      this.socketMessaging.sendErrorMessageToCharacter(character, `You are the owner of this item`);
      return false;
    }

    const wasBought = await this.characterTradingMarketplaceBuy.buyItem(character, marketplaceItem);
    if (!wasBought) {
      await marketplaceItem.updateOne({ isBeingBought: false });
      return false;
    }

    this.socketMessaging.sendEventToUser(character.channelId!, MarketplaceSocketEvents.RefreshItems);

    return true;
  }
}
