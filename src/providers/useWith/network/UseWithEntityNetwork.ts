import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IUseWithEntity, UseWithSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { UseWithEntity } from "../UseWithEntity";

@provide(UseWithEntityNetwork)
export class UseWithEntityNetwork {
  constructor(private socketAuth: SocketAuth, private useWithEntity: UseWithEntity) {}

  public onUseWithEntity(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      UseWithSocketEvents.UseWithEntity,
      async (data: IUseWithEntity, character) => {
        if (data) {
          await this.useWithEntity.execute(data, character);
        }
      }
    );
  }
}
