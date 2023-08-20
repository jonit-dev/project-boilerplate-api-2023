import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IMarketplaceGetItems, MarketplaceSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MarketplaceGetItems } from "../MarketplaceGetItems";

@provide(MarketplaceGetItemsNetwork)
export class MarketplaceGetItemsNetwork {
  constructor(private socketAuth: SocketAuth, private marketplaceGetItems: MarketplaceGetItems) {}

  public onGetItems(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      MarketplaceSocketEvents.GetItems,
      async ({ npcId, options }: IMarketplaceGetItems, character) => {
        await this.marketplaceGetItems.getItems(character, npcId, options);
      }
    );
  }
}
