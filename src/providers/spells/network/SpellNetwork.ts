import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { SpellNetworkCast } from "./SpellNetworkCast";
import { SpellNetworkReadInfo } from "./SpellNetworkReadInfo";

@provide(SpellNetwork)
export class SpellNetwork {
  constructor(private spellNetworkReadInfo: SpellNetworkReadInfo, private spellNetworkCast: SpellNetworkCast) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.spellNetworkReadInfo.onGetInfo(channel);
    this.spellNetworkCast.onSpellCast(channel);
  }
}
