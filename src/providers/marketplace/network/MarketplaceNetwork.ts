import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { MarketplaceGetItemsNetwork } from "./MarketplaceGetItemsNetwork";
import { MarketplaceItemAddRemoveNetwork } from "./MarketplaceItemAddRemoveNetwork";
import { MarketplaceItemBuyNetwork } from "./MarketplaceItemBuyNetwork";
import { MarketplaceMoneyWithdrawNetwork } from "./MarketplaceMoneyWithdrawNetwork";

@provide(MarketplaceNetwork)
export class MarketplaceNetwork {
  constructor(
    private marketplaceGetItemsNetwork: MarketplaceGetItemsNetwork,
    private marketplaceItemAddRemoveNetwork: MarketplaceItemAddRemoveNetwork,
    private marketplaceItemBuyNetwork: MarketplaceItemBuyNetwork,
    private marketplaceMoneyWithdrawNetwork: MarketplaceMoneyWithdrawNetwork
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.marketplaceGetItemsNetwork.onGetItems(channel);
    this.marketplaceItemAddRemoveNetwork.onItemAddRemove(channel);
    this.marketplaceItemBuyNetwork.onItemBuy(channel);
    this.marketplaceMoneyWithdrawNetwork.onMoneyWithdraw(channel);
  }
}
