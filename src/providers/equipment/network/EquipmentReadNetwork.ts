import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { EquipmentSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { EquipmentRead } from "../EquipmentRead";

@provide(EquipmentReadNetwork)
export class EquipmentReadNetwork {
  constructor(private socketAuth: SocketAuth, private equipmentRead: EquipmentRead) {}

  public onRead(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, EquipmentSocketEvents.ContainerRead, async (data: any, character) => {
      await this.equipmentRead.onEquipmentRead(character);
    });
  }
}
