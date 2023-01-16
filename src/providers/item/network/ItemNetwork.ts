import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { ItemNetworkInfo } from "./ItemNetworkInfo";
import { ItemNetworkUpdate } from "./ItemNetworkUpdate";
import { ItemNetworkPickup } from "./ItemNetworkPickup";
import { ItemNetworkDrop } from "./ItemNetworkDrop";
import { ItemNetworkUse } from "./ItemNetworkUse";
import { ItemNetworkCraftable } from "./ItemNetworkCraftable";
import { ItemNetworkMove } from "./itemNetworkMove";

@provide(ItemNetwork)
export class ItemNetwork {
  constructor(
    private itemNetworkUpdate: ItemNetworkUpdate,
    private itemNetworkInfo: ItemNetworkInfo,
    private itemNetworkPickup: ItemNetworkPickup,
    private itemNetworkDrop: ItemNetworkDrop,
    private itemNetworkUse: ItemNetworkUse,
    private itemNetworkCraftable: ItemNetworkCraftable,
    private itemNetworkMove: ItemNetworkMove
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.itemNetworkUpdate.onItemUpdate(channel);
    this.itemNetworkInfo.onGetItemInfo(channel);
    this.itemNetworkPickup.onItemPickup(channel);
    this.itemNetworkDrop.onItemDrop(channel);
    this.itemNetworkUse.onItemUse(channel);
    this.itemNetworkCraftable.onCraftableItemsLoad(channel);
    this.itemNetworkCraftable.onCraftItem(channel);
    this.itemNetworkMove.onItemMove(channel);
  }
}
