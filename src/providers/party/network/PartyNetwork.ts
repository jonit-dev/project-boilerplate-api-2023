import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { PartyNetworkCreate } from "./PartyNetworkCreate";
import { PartyNetworkLeave } from "./PartyNetworkLeave";
import { PartyNetworkTranferLeaderShip } from "./PartyNetworkTranferLeaderShip";
import { PartyNetworkInvite } from "./PartyNetworkInvite";

@provide(PartyNetwork)
export class PartyNetwork {
  constructor(
    private partyNetworkCreate: PartyNetworkCreate,
    private partyNetworkLeave: PartyNetworkLeave,
    private partyNetworkTransfer: PartyNetworkTranferLeaderShip,
    private partyNetworkInvite: PartyNetworkInvite
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.partyNetworkCreate.onCreateParty(channel);
    this.partyNetworkLeave.onLeaveParty(channel);
    this.partyNetworkTransfer.onTranferLeaderShip(channel);
    this.partyNetworkInvite.onInviteParty(channel);
  }
}
