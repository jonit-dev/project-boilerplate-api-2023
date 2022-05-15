import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { BattleNetworkInitTargeting } from "./BattleNetworkInitTargeting";
import { BattleNetworkStopTargeting } from "./BattleNetworkStopTargetting";

@provide(BattleNetwork)
export class BattleNetwork {
  constructor(
    private battleNetworkInitTargeting: BattleNetworkInitTargeting,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.battleNetworkInitTargeting.onBattleInitTargeting(channel);
    this.battleNetworkStopTargeting.onBattleStopTargeting(channel);
  }
}
