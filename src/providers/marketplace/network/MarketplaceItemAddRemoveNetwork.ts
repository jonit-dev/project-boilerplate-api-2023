import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { MarketplaceItemAddRemove } from "../MarketplaceItemAddRemove";
import { IMarketplaceAddItem, IMarketplaceRemoveItem, MarketplaceSocketEvents } from "@rpg-engine/shared";

@provide(MarketplaceItemAddRemoveNetwork)
export class MarketplaceItemAddRemoveNetwork {
  constructor(private socketAuth: SocketAuth, private mrketplaceItemAddRemove: MarketplaceItemAddRemove) {}

  public onItemAddRemove(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      MarketplaceSocketEvents.AddItem,
      async ({ npcId, marketplaceItem }: IMarketplaceAddItem, character) => {
        this.mrketplaceItemAddRemove.addItemToMarketplace(character, npcId, marketplaceItem);
      }
    );

    this.socketAuth.authCharacterOn(
      channel,
      MarketplaceSocketEvents.RemoveItem,
      async ({ npcId, marketplaceItemId }: IMarketplaceRemoveItem, character) => {
        this.mrketplaceItemAddRemove.removeItemFromMarketplaceToInventory(character, npcId, marketplaceItemId);
      }
    );
  }
}
