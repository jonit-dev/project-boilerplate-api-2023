import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { SpellNetworkCast } from "./SpellNetworkCast";
import { SpellNetworkReadInfo } from "./SpellNetworkReadInfo";
import { SpellNetworkDetails } from "./SpellNetworkDetails";

@provide(SpellNetwork)
export class SpellNetwork {
  constructor(
    private spellNetworkReadInfo: SpellNetworkReadInfo,
    private spellNetworkCast: SpellNetworkCast,
    private spellNetworkDetails: SpellNetworkDetails
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.spellNetworkReadInfo.onGetInfo(channel);
    this.spellNetworkCast.onSpellCast(channel);
    this.spellNetworkDetails.onGetDetails(channel);
  }
}
