import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { BattleCycle } from "@providers/battle/BattleCycle";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketConnection } from "@providers/sockets/SocketConnection";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { CharacterSocketEvents, ICharacterLogout } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterView } from "../CharacterView";

@provide(CharacterNetworkLogout)
export class CharacterNetworkLogout {
  constructor(
    private socketMessagingHelper: SocketMessaging,
    private socketAuth: SocketAuth,
    private socketConnection: SocketConnection,
    private characterView: CharacterView
  ) {}

  public onCharacterLogout(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterLogout,
      async (data: ICharacterLogout, character: ICharacter) => {
        const nearbyCharacters = await this.characterView.getCharactersInView(character);

        for (const character of nearbyCharacters) {
          this.socketMessagingHelper.sendEventToUser<ICharacterLogout>(
            character.channelId!,
            CharacterSocketEvents.CharacterLogout,
            data
          );
        }

        console.log(`🚪: Character id ${data.id} has disconnected`);

        await Character.updateOne({ _id: data.id }, { isOnline: false });

        const battleCycle = BattleCycle.battleCycles.get(data.id);

        if (battleCycle) {
          await battleCycle.clear();
        }

        const connectedCharacters = await this.socketConnection.getConnectedCharacters();

        console.log("- Total characters connected:", connectedCharacters.length);
      }
    );
  }
}
