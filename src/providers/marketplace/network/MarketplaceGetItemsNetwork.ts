import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { MarketplaceGetItems } from "../MarketplaceGetItems";
import { IMarketplaceGetItems, MarketplaceSocketEvents } from "@rpg-engine/shared";

@provide(MarketplaceGetItemsNetwork)
export class MarketplaceGetItemsNetwork {
  constructor(private socketAuth: SocketAuth, private marketplaceGetItems: MarketplaceGetItems) {}

  public onGetItems(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      MarketplaceSocketEvents.GetItems,
      async ({ npcId, options }: IMarketplaceGetItems, character) => {
        this.marketplaceGetItems.getItems(character, npcId, options);
      }
    );
  }
}
