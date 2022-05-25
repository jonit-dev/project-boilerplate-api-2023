import { BattleNetwork } from "@providers/battle/network/BattleNetwork";
import { CharacterNetwork } from "@providers/character/network/CharacterNetwork";
import { ChatNetwork } from "@providers/chat/network/ChatNetwork";
import { ItemNetwork } from "@providers/item/network/ItemNetwork";
import { NPCNetwork } from "@providers/npc/network/NPCNetwork";
import { ViewNetwork } from "@providers/view/network/ViewNetwork";
import { provide } from "inversify-binding-decorators";
import { SocketChannel } from "./SocketsTypes";

@provide(SocketEventsBinder)
export class SocketEventsBinder {
  constructor(
    private characterNetwork: CharacterNetwork,
    private npcNetwork: NPCNetwork,
    private battleNetwork: BattleNetwork,
    private chatNetwork: ChatNetwork,
    private itemNetwork: ItemNetwork,
    private viewNetwork: ViewNetwork
  ) {}

  public bindEvents(channel: SocketChannel): void {
    this.characterNetwork.onAddEventListeners(channel);
    this.npcNetwork.onAddEventListeners(channel);
    this.battleNetwork.onAddEventListeners(channel);
    this.chatNetwork.onAddEventListeners(channel);
    this.itemNetwork.onAddEventListeners(channel);
    this.viewNetwork.onAddEventListeners(channel);
  }
}
