import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import { EquipmentEquipNetwork } from "./EquipmentEquipNetwork";

@provide(EquipmentNetwork)
export class EquipmentNetwork {
  constructor(private equipmentEquipNetwork: EquipmentEquipNetwork) {}

  public onAddEventListeners(channel: SocketChannel): void {
    this.equipmentEquipNetwork.onItemEquip(channel);
  }
}
