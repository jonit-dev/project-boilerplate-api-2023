import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IUseWithEntity } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(UseWithEntity)
export class UseWithEntity {
  constructor(private socketMessaging: SocketMessaging) {}

  public async execute(payload: IUseWithEntity, character: ICharacter): Promise<void> {
    await Promise.resolve();
    this.socketMessaging.sendErrorMessageToCharacter(character, "This feature has not yet been implemented.");
  }
}
