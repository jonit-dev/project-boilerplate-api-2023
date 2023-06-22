import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterView } from "@providers/character/CharacterView";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IViewDestroyElementPayload, ViewSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ViewNetworkDestroy)
export class ViewNetworkDestroy {
  constructor(private socketAuth: SocketAuth, private characterView: CharacterView) {}

  public onViewElementDestroy(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      ViewSocketEvents.Destroy,
      async (data: IViewDestroyElementPayload, character: ICharacter) => {
        await this.characterView.removeFromCharacterView(character._id, data.id, data.type);
      }
    );
  }
}
