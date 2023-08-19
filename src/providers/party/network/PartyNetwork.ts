import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";

import { PartyNetworkInviteOrCreate } from "./PartyNetworkInviteOrCreate";
import { PartyNetworkLeave } from "./PartyNetworkLeave";
import { PartyNetworkTranferLeaderShip } from "./PartyNetworkTranferLeaderShip";
import { PartyNetworkAcceptInvite } from "./PartyNetworkAcceptInvite";
import { PartyNetworkGetParty } from "./PartyNetworkGetParty";

@provide(PartyNetwork)
export class PartyNetwork {
  constructor(
    private partyNetworkInviteOrCreate: PartyNetworkInviteOrCreate,
    private partyNetworkLeave: PartyNetworkLeave,
    private partyNetworkTransfer: PartyNetworkTranferLeaderShip,
    private partyNetworkAcceptInvite: PartyNetworkAcceptInvite,
    private partyNetworkGetParty: PartyNetworkGetParty
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.partyNetworkGetParty.onPartyInfoRead(channel);
    this.partyNetworkInviteOrCreate.onInviteOrCreateParty(channel);
    this.partyNetworkAcceptInvite.onAcceptInvite(channel);
    this.partyNetworkTransfer.onTranferLeaderShip(channel);
    this.partyNetworkLeave.onLeaveParty(channel);
  }
}
