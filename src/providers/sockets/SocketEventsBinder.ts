import { BattleNetwork } from "@providers/battle/network/BattleNetwork";
import { CharacterNetwork } from "@providers/character/network/CharacterNetwork";
import { ChatNetwork } from "@providers/chat/network/ChatNetwork";
import { EquipmentNetwork } from "@providers/equipment/network/EquipmentNetwork";
import { ItemNetwork } from "@providers/item/network/ItemNetwork";
import { ItemContainerNetwork } from "@providers/itemContainer/network/ItemContainerNetwork";
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
    private viewNetwork: ViewNetwork,
    private itemContainerNetwork: ItemContainerNetwork,
    private equipmentNetwork: EquipmentNetwork
  ) {}

  public bindEvents(channel: SocketChannel): void {
    this.characterNetwork.onAddEventListeners(channel);
    this.npcNetwork.onAddEventListeners(channel);
    this.battleNetwork.onAddEventListeners(channel);
    this.chatNetwork.onAddEventListeners(channel);
    this.itemNetwork.onAddEventListeners(channel);
    this.viewNetwork.onAddEventListeners(channel);
    this.itemContainerNetwork.onAddEventListeners(channel);
    this.equipmentNetwork.onAddEventListeners(channel);
  }
}
