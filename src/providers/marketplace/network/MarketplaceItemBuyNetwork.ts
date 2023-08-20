import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IMarketplaceBuyItem, MarketplaceSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MarketplaceItemBuy } from "../MarketplaceItemBuy";

@provide(MarketplaceItemBuyNetwork)
export class MarketplaceItemBuyNetwork {
  constructor(private socketAuth: SocketAuth, private marketplaceItemBuy: MarketplaceItemBuy) {}

  public onItemBuy(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      MarketplaceSocketEvents.BuyItem,
      async ({ npcId, marketplaceItemId }: IMarketplaceBuyItem, character) => {
        await this.marketplaceItemBuy.buyItemFromMarketplace(character, npcId, marketplaceItemId);
      }
    );
  }
}
