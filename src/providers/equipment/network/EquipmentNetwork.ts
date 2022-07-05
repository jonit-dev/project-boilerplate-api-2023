import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { EquipmentEquipNetwork } from "./EquipmentEquipNetwork";
import { EquipmentRead } from "./EquipmentRead";
import { EquipmentUnequipNetwork } from "./EquipmentUnequipNetwork";

@provide(EquipmentNetwork)
export class EquipmentNetwork {
  constructor(
    private equipmentEquipNetwork: EquipmentEquipNetwork,
    private equipmentUnequipNetwork: EquipmentUnequipNetwork,
    private equipmentRead: EquipmentRead
  ) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.equipmentEquipNetwork.onItemEquip(channel);
    this.equipmentUnequipNetwork.onItemUnequip(channel);
    this.equipmentRead.onRead(channel);
  }
}
