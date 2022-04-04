import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { NPCNetworkDialogStart } from "./dialog/NPCNetworkDialogStart";
import { NPCNetworkDialogStop } from "./dialog/NPCNetworkDialogStop";

@provide(NPCNetwork)
export class NPCNetwork {
  constructor(private npcDialogStart: NPCNetworkDialogStart, private npcDialogStop: NPCNetworkDialogStop) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.npcDialogStart.onDialogStart(channel);
    this.npcDialogStop.onDialogStop(channel);
  }
}
