import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IUseWithEntity, UseWithSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(UseWithEntity)
export class UseWithEntity {
  constructor(private socketMessaging: SocketMessaging, private socketAuth: SocketAuth) {}

  public onUseWithEntity(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      UseWithSocketEvents.UseWithEntity,
      async (data: IUseWithEntity, character) => {
        if (data) {
          await this.execute(data, character);
        }
      }
    );
  }

  public async execute(payload: IUseWithEntity, character: ICharacter): Promise<void> {
    await Promise.resolve();
    this.socketMessaging.sendErrorMessageToCharacter(character, "This feature has not yet been implemented.");
  }
}
