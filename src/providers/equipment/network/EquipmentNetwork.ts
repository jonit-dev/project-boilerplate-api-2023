import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { EquipmentEquipNetwork } from "./EquipmentEquipNetwork";
import { EquipmentUnequipNetwork } from "./EquipmentUnequipNetwork";
import { EquipmentReadNetwork } from "./EquipmentReadNetwork";

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
