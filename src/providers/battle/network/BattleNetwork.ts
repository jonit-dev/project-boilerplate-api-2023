import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { BattleNetworkInitTargeting } from "./BattleNetworkInitTargeting";

@provide(BattleNetwork)
export class BattleNetwork {
  constructor(private battleNetworkInitTargeting: BattleNetworkInitTargeting) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.battleNetworkInitTargeting.onBattleInitTargeting(channel);
  }
}
