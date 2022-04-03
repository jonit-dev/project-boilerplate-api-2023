import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { NPCNetworkInfo } from "./NPCNetworkInfo";

@provide(NPCNetwork)
export class NPCNetwork {
  constructor(private npcInfo: NPCNetworkInfo) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.npcInfo.onNPCInfo(channel);
  }
}
