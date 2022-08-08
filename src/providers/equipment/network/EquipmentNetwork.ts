import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { EquipmentEquipNetwork } from "./EquipmentEquipNetwork";
import { EquipmentReadNetwork } from "./EquipmentReadNetwork";
import { EquipmentUnequipNetwork } from "./EquipmentUnequipNetwork";

@provide(EquipmentNetwork)
export class EquipmentNetwork {
  constructor(
    private equipmentEquipNetwork: EquipmentEquipNetwork,
    private equipmentUnequipNetwork: EquipmentUnequipNetwork,
    private equipmentReadNetwork: EquipmentReadNetwork
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.equipmentEquipNetwork.onItemEquip(channel);
    this.equipmentUnequipNetwork.onItemUnequip(channel);
    this.equipmentReadNetwork.onRead(channel);
  }
}
