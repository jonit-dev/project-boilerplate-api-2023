import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { SpellNetworkCast } from "./SpellNetworkCast";
import { SpellNetworkReadInfo } from "./SpellNetworkReadInfo";
import { SpellNetworkDetails } from "./SpellNetworkDetails";
import { SpellNetworkLearned } from "./SpellNetworkLearned";

@provide(SpellNetwork)
export class SpellNetwork {
  constructor(
    private spellNetworkReadInfo: SpellNetworkReadInfo,
    private spellNetworkCast: SpellNetworkCast,
    private spellNetworkDetails: SpellNetworkDetails,
    private spellNetworkLearned: SpellNetworkLearned
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.spellNetworkReadInfo.onGetInfo(channel);
    this.spellNetworkCast.onSpellCast(channel);
    this.spellNetworkDetails.onGetDetails(channel);
    this.spellNetworkLearned.onGetDetails(channel);
  }
}
