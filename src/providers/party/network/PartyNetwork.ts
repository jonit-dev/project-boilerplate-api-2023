import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";

import { PartyNetworkLeave } from "./PartyNetworkLeave";
import { PartyNetworkTranferLeaderShip } from "./PartyNetworkTranferLeaderShip";
import { PartyNetworkGetParty } from "./PartyNetworkGetParty";
import { PartyNetworkInviteToParty } from "./PartyNetworkInviteToParty";

@provide(PartyNetwork)
export class PartyNetwork {
  constructor(
    private partyNetworkLeave: PartyNetworkLeave,
    private partyNetworkTransfer: PartyNetworkTranferLeaderShip,
    private partyNetworkGetParty: PartyNetworkGetParty,
    private partyNetworkInviteToParty: PartyNetworkInviteToParty
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.partyNetworkGetParty.onPartyPayloadSend(channel);
    this.partyNetworkInviteToParty.onInviteToParty(channel);
    this.partyNetworkTransfer.onTranferLeaderShip(channel);
    this.partyNetworkLeave.onLeaveParty(channel);
  }
}
