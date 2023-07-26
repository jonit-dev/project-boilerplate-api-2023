import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";

import { PartyNetworkInviteOrCreate } from "./PartyNetworkInviteOrCreate";
import { PartyNetworkLeave } from "./PartyNetworkLeave";
import { PartyNetworkTranferLeaderShip } from "./PartyNetworkTranferLeaderShip";

@provide(PartyNetwork)
export class PartyNetwork {
  constructor(
    private partyNetworkInviteOrCreate: PartyNetworkInviteOrCreate,
    private partyNetworkLeave: PartyNetworkLeave,
    private partyNetworkTransfer: PartyNetworkTranferLeaderShip
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.partyNetworkInviteOrCreate.onInviteOrCreateParty(channel);
    this.partyNetworkLeave.onLeaveParty(channel);
    this.partyNetworkTransfer.onTranferLeaderShip(channel);
  }
}
