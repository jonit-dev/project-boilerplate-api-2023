import { BattleNetwork } from "@providers/battle/network/BattleNetwork";
import { CharacterNetwork } from "@providers/character/network/CharacterNetwork";
import { ChatNetwork } from "@providers/chat/network/ChatNetwork";
import { appEnv } from "@providers/config/env";
import { DepotNetwork } from "@providers/depot/network/DepotNetwork";
import { EquipmentNetwork } from "@providers/equipment/network/EquipmentNetwork";
import { ItemNetwork } from "@providers/item/network/ItemNetwork";
import { ItemContainerNetwork } from "@providers/itemContainer/network/ItemContainerNetwork";
import { NPCNetwork } from "@providers/npc/network/NPCNetwork";
import { QuestNetwork } from "@providers/quest/network/QuestNetwork";
import { SkillNetwork } from "@providers/skill/network/SkillNetwork";
import { UseWithNetwork } from "@providers/useWith/network/UseWithNetwork";
import { ViewNetwork } from "@providers/view/network/ViewNetwork";
import { EnvType } from "@rpg-engine/shared";
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
    private equipmentNetwork: EquipmentNetwork,
    private skillNetwork: SkillNetwork,
    private questNetwork: QuestNetwork,
    private useWithNetwork: UseWithNetwork,
    private depotNetwork: DepotNetwork
  ) {}

  public bindEvents(channel: SocketChannel): void {
    switch (appEnv.general.ENV) {
      case EnvType.Development:
        this.characterNetwork.onAddEventListeners(channel);
        this.npcNetwork.onAddEventListeners(channel);
        this.battleNetwork.onAddEventListeners(channel);
        this.chatNetwork.onAddEventListeners(channel);
        this.itemNetwork.onAddEventListeners(channel);
        this.viewNetwork.onAddEventListeners(channel);
        this.itemContainerNetwork.onAddEventListeners(channel);
        this.equipmentNetwork.onAddEventListeners(channel);
        this.skillNetwork.onAddEventListeners(channel);
        this.questNetwork.onAddEventListeners(channel);
        this.useWithNetwork.onAddEventListeners(channel);
        this.depotNetwork.onAddEventListeners(channel);
        break;
      case EnvType.Staging:
      case EnvType.Production:
        const pm2Instance = process.env.NODE_APP_INSTANCE;

        switch (pm2Instance) {
          case "0":
            this.characterNetwork.onAddEventListeners(channel);
            this.npcNetwork.onAddEventListeners(channel);
            break;
          case "1":
            this.battleNetwork.onAddEventListeners(channel);
            this.chatNetwork.onAddEventListeners(channel);
            this.itemNetwork.onAddEventListeners(channel);
            this.viewNetwork.onAddEventListeners(channel);
            this.itemContainerNetwork.onAddEventListeners(channel);
            this.equipmentNetwork.onAddEventListeners(channel);
            this.skillNetwork.onAddEventListeners(channel);
            this.questNetwork.onAddEventListeners(channel);
            this.useWithNetwork.onAddEventListeners(channel);
            this.depotNetwork.onAddEventListeners(channel);
            break;
        }

        break;
    }
  }
}
