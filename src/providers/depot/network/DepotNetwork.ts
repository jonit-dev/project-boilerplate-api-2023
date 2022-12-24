import { provide } from "inversify-binding-decorators";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { DepotNetworkOpen } from "@providers/depot/network/DepotNetworkOpen";
import { DepotNetworkDeposit } from "./DepotNetworkDeposit";
import { DepotNetworkWithdraw } from "./DepotNetworkWithdraw";

@provide(DepotNetwork)
export class DepotNetwork {
  constructor(
    private open: DepotNetworkOpen,
    private deposit: DepotNetworkDeposit,
    private withdraw: DepotNetworkWithdraw
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.open.onDepotContainerOpen(channel);
    this.deposit.onDepotContainerDeposit(channel);
    this.withdraw.onDepotContainerWithdraw(channel);
  }
}
