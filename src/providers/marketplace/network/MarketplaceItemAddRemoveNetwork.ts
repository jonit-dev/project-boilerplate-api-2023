import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IMarketplaceAddItem, IMarketplaceRemoveItem, MarketplaceSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MarketplaceItemAddRemove } from "../MarketplaceItemAddRemove";

@provide(MarketplaceItemAddRemoveNetwork)
export class MarketplaceItemAddRemoveNetwork {
  constructor(private socketAuth: SocketAuth, private marketplaceItemAddRemove: MarketplaceItemAddRemove) {}

  public onItemAddRemove(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      MarketplaceSocketEvents.AddItem,
      async ({ npcId, marketplaceItem }: IMarketplaceAddItem, character) => {
        await this.marketplaceItemAddRemove.addItemToMarketplace(character, npcId, marketplaceItem);
      }
    );

    this.socketAuth.authCharacterOn(
      channel,
      MarketplaceSocketEvents.RemoveItem,
      async ({ npcId, marketplaceItemId }: IMarketplaceRemoveItem, character) => {
        await this.marketplaceItemAddRemove.removeItemFromMarketplaceToInventory(character, npcId, marketplaceItemId);
      }
    );
  }
}
