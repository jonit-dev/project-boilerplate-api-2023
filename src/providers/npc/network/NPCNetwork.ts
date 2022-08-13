import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { NPCNetworkDialogStart } from "./dialog/NPCNetworkDialogStart";
import { NPCNetworkDialogStop } from "./dialog/NPCNetworkDialogStop";
import { NPCNetworkGetQuests } from "./dialog/NPCNetworkGetQuests";
import { NPCNetworkChooseQuest } from "./dialog/NPCNetworkChooseQuest";

@provide(NPCNetwork)
export class NPCNetwork {
  constructor(
    private npcDialogStart: NPCNetworkDialogStart,
    private npcDialogStop: NPCNetworkDialogStop,
    private npcGetQuests: NPCNetworkGetQuests,
    private npcChooseQuest: NPCNetworkChooseQuest
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.npcDialogStart.onDialogStart(channel);
    this.npcDialogStop.onDialogStop(channel);
    this.npcGetQuests.onGetQuests(channel);
    this.npcChooseQuest.onChooseQuest(channel);
  }
}
